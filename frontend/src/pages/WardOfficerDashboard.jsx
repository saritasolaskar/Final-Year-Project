import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  UserCheck,
  Sparkles,
  Clock,
  Send,
  X,
  XCircle,
  HardHat,
  Phone,
  MapPin,
  AlertOctagon
} from 'lucide-react';
import CivicMap from '../components/CivicMap';
import JurisdictionExplorer from '../components/JurisdictionExplorer';

export default function WardOfficerDashboard() {
  const { user } = useAuth();
  const { issues, workers, wards, assignTaskToWorker, updateIssue, notify } = useCivic();
  const [filter, setFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  // Task Assignment State
  const [dispatchModalTicket, setDispatchModalTicket] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [slaTargetHours, setSlaTargetHours] = useState(24);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Rejection State
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingApprovals = issues.filter((i) => i.status === 'Verification-Pending');
  const criticalCount = issues.filter((i) => i.priorityScore >= 90 && i.status !== 'Closed').length;

  const handleOpenDispatch = (ticket) => {
    setDispatchModalTicket(ticket);
    // AI Best Match Finder: Match Department + Lowest Active Load
    const departmentWorkers = workers.filter((w) => w.department === ticket.department);
    const pool = departmentWorkers.length > 0 ? departmentWorkers : workers;
    const bestMatch = pool.reduce(
      (best, w) => (w.activeTasksCount < (best?.activeTasksCount || 99) ? w : best),
      pool[0] || null
    );

    setSelectedWorker(bestMatch);
    setSlaTargetHours(ticket.priorityScore >= 90 ? 12 : 24);
    setSpecialInstructions(
      ticket.category.includes('Pothole')
        ? 'Use cold-mix bitumen asphalt; traffic diversion caution near junction.'
        : ticket.category.includes('Manhole')
        ? 'Urgent: Replace cast-iron heavy chamber lid; barricade pedestrian walkway.'
        : 'Clear commercial waste and disinfect area with bleaching powder.'
    );
  };

  const handleConfirmAssignment = () => {
    if (!selectedWorker || !dispatchModalTicket) return;
    assignTaskToWorker(dispatchModalTicket.id, {
      workerEmail: selectedWorker.email,
      workerName: selectedWorker.name,
      workerPhone: selectedWorker.phone,
      slaTargetHours,
      specialInstructions,
    });
    setDispatchModalTicket(null);
  };

  const handleApproveFix = (id) => {
    updateIssue(id, { status: 'Closed' });
    notify(`✅ Issue ${id} verified and officially Closed.`);
  };

  const handleRejectFix = (id) => {
    updateIssue(id, { status: 'In-Progress', blockerReason: 'Officer rejected repair quality. Rework mandated.' });
    notify(`⚠️ Rework mandated for ${id}. Re-sent to worker queue.`);
  };

  const handleRejectSpurious = (id) => {
    updateIssue(id, { status: 'Rejected', rejectionReason });
    setRejectModal(null);
    setRejectReason('');
    notify(`❌ Issue ${id} rejected and archived.`);
  };

  const filteredIssues = issues
    .filter((i) => (filter === 'critical' ? i.priorityScore >= 90 : true))
    .filter((i) => (deptFilter === 'all' ? true : i.department === deptFilter));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Ward Metric Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <span className="text-xs text-slate-400">Jurisdiction</span>
          <h3 className="text-base font-black text-white mt-1">{user?.ward}</h3>
          <span className="text-[10px] text-amber-400 font-mono">Bhosari (AC 207)</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <span className="text-xs text-slate-400">Active Issues</span>
          <h3 className="text-2xl font-black text-rose-400 font-mono mt-1">
            {issues.filter((i) => i.status !== 'Closed' && i.status !== 'Rejected').length}
          </h3>
          <span className="text-[10px] text-rose-400">{criticalCount} Critical (&ge;90)</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <span className="text-xs text-slate-400">AI Approvals Pending</span>
          <h3 className="text-2xl font-black text-purple-400 font-mono mt-1">{pendingApprovals.length}</h3>
          <span className="text-[10px] text-purple-300">Before/After Check</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <span className="text-xs text-slate-400">Resolved & Closed</span>
          <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {issues.filter((i) => i.status === 'Closed').length}
          </h3>
          <span className="text-[10px] text-emerald-400">SLA Standard Met</span>
        </div>
      </div>

      {/* Ward GIS Map */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Bhosari Ward GIS Hazard Distribution
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">🔴 Critical (&ge;90)  🟠 High (70-89)  🔵 Normal</span>
        </div>
        <CivicMap issues={issues} center={[18.6298, 73.8477]} zoom={13} />
      </div>

      {/* Jurisdiction Hierarchy */}
      <JurisdictionExplorer wards={wards} />

      {/* AI Resolution Verification Hub */}
      {pendingApprovals.length > 0 && (
        <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-700/50 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-purple-400 w-5 h-5" /> Before vs. After Resolution Verification Hub
          </h3>
          {pendingApprovals.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1 font-mono">BEFORE (CITIZEN)</span>
                  <img src={item.beforeImageUrl} className="w-20 h-16 object-cover rounded-xl border border-slate-700" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 block mb-1 font-mono">AFTER (WORKER FIX)</span>
                  <img src={item.afterImageUrl} className="w-20 h-16 object-cover rounded-xl border border-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.category} • {item.id}</h4>
                  <p className="text-xs text-slate-400">{item.locationName}</p>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded font-mono">
                    AI Change Match: {item.aiVerificationScore}% Confirmed
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRejectFix(item.id)}
                  className="bg-slate-800 hover:bg-rose-950 text-rose-300 text-xs font-bold px-3 py-2 rounded-xl border border-rose-800/50 transition"
                >
                  Demand Rework
                </button>
                <button
                  onClick={() => handleApproveFix(item.id)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Approve & Close
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic AI Priority Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Dynamic AI Priority Queue</h3>
            <p className="text-xs text-slate-400">Ranked by Multi-Criteria Model (Severity × Duplicates × Spine Road Corridor Traffic)</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="PCMC Civil & Road Maintenance Dept">Roads & Infra</option>
              <option value="PCMC Health & Solid Waste Dept">Solid Waste (SWM)</option>
              <option value="PCMC Drainage & Sewerage Dept">Drainage & Sewerage</option>
              <option value="PCMC Electrical Dept">Electrical & Lighting</option>
            </select>

            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-xl text-xs ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>All</button>
            <button onClick={() => setFilter('critical')} className={`px-3 py-1 rounded-xl text-xs ${filter === 'critical' ? 'bg-rose-950 text-rose-300' : 'text-slate-400'}`}>Critical (&gt;90)</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Category & ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Duplicates</th>
                <th className="py-3 px-4">Assigned Crew</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredIssues.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-black">
                    <span className={`px-2 py-0.5 rounded ${item.priorityScore >= 90 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-blue-500/20 text-blue-400'}`}>
                      {item.priorityScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{item.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.id}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{item.department}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-[160px] truncate">{item.locationName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                      👥 {item.duplicateCount} merged
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {item.assignedWorkerName !== 'Unassigned' ? (
                      <div>
                        <span className="font-semibold text-white">{item.assignedWorkerName}</span>
                        <span className="text-[10px] text-slate-500 block font-mono">SLA: {item.slaTargetHours}h</span>
                      </div>
                    ) : (
                      <span className="text-amber-400 font-semibold font-mono">⚡ Auto-Ready</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {item.status === 'Reported' || item.status === 'Assigned' ? (
                      <>
                        <button
                          onClick={() => handleOpenDispatch(item)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-[11px] shadow transition"
                        >
                          {item.status === 'Assigned' ? 'Re-assign' : 'Dispatch ⚡'}
                        </button>
                        <button
                          onClick={() => setRejectModal(item)}
                          className="bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 px-2.5 py-1.5 rounded-xl text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-slate-500 font-mono">{item.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ⚡ ADVANCED TASK ASSIGNMENT DISPATCH MODAL                                 */}
      {/* ========================================================================= */}
      {dispatchModalTicket && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/60 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <UserCheck className="text-amber-400 w-5 h-5" />
                  <h3 className="text-base font-black text-white">Smart Task Assignment & Dispatcher</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Ticket: <span className="font-mono text-amber-300">{dispatchModalTicket.id}</span> • {dispatchModalTicket.category}
                </p>
              </div>
              <button
                onClick={() => setDispatchModalTicket(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Best Match Recommendation Banner */}
            {selectedWorker && (
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      AI Optimal Match (98% Confidence)
                    </span>
                    <h4 className="text-xs font-bold text-white">{selectedWorker.name}</h4>
                    <p className="text-[10px] text-slate-400">{selectedWorker.department} • {selectedWorker.currentLocationName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                    {selectedWorker.activeTasksCount}/4 Load
                  </span>
                </div>
              </div>
            )}

            {/* Select Worker Roster List with Live Load Progress Bar */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>Select Ground Crew / Mukadam:</span>
                <span className="text-[10px] text-slate-400 font-normal">Workload capacity tracked in real time</span>
              </label>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {workers.map((worker) => {
                  const isSelected = selectedWorker?.email === worker.email;
                  const isOverloaded = worker.activeTasksCount >= 4;
                  return (
                    <div
                      key={worker._id}
                      onClick={() => !isOverloaded && setSelectedWorker(worker)}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-white'
                          : isOverloaded
                          ? 'bg-rose-950/20 border-rose-800/40 opacity-60 cursor-not-allowed'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <HardHat className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <div>
                          <h5 className="text-xs font-bold text-white">{worker.name}</h5>
                          <p className="text-[10px] text-slate-400">{worker.department} • {worker.phone}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          isOverloaded ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {worker.activeTasksCount}/4 Active
                        </span>
                        {/* Capacity Progress Bar */}
                        <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isOverloaded ? 'bg-rose-500' : 'bg-emerald-400'}`}
                            style={{ width: `${(worker.activeTasksCount / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SLA Target Hours Picker & Field Instructions */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target SLA</label>
                <select
                  value={slaTargetHours}
                  onChange={(e) => setSlaTargetHours(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={12}>12 Hours (Urgent)</option>
                  <option value={24}>24 Hours (Standard)</option>
                  <option value={48}>48 Hours (Routine)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Special JE Technical Directive</label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Use cold-mix bitumen; barricade signal..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setDispatchModalTicket(null)}
                className="w-1/3 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                className="w-2/3 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" /> Confirm Task Dispatch ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="text-rose-400 w-4 h-4" /> Reject Spurious Complaint
            </h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="State reason (e.g. Non-civic issue, private property)..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex gap-2">
              <button onClick={() => setRejectModal(null)} className="w-1/2 bg-slate-800 py-2 rounded-xl text-xs text-slate-300 font-semibold">Cancel</button>
              <button onClick={() => handleRejectSpurious(rejectModal.id)} className="w-1/2 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-xl text-xs font-bold">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}