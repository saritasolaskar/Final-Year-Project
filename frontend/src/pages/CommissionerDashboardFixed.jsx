import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Activity,
  Trophy,
  AlertTriangle,
  Layers,
  ShieldAlert,
  X,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  BarChart2,
  Phone
} from 'lucide-react';
import CivicMap from '../components/CivicMap';
import JurisdictionExplorer from '../components/JurisdictionExplorer';

export default function CommissionerDashboard() {
  const { wards, issues, notify } = useCivic();
  const [activeModal, setActiveModal] = useState(null); // 'sla_risk' | 'health_index' | 'intake' | 'resolved' | 'ward_detail'
  const [selectedWardDetail, setSelectedWardDetail] = useState(null);

  const totalComplaints = wards.reduce((sum, w) => sum + w.totalReported, 0);
  const totalResolved = wards.reduce((sum, w) => sum + w.totalResolved, 0);

  // Highest priority critical issue across PCMC Bhosari AC 207
  const highestPriorityIssue = issues.reduce(
    (max, i) => (i.priorityScore > (max?.priorityScore || 0) ? i : max),
    issues[0] || null
  );

  const openWardModal = (ward) => {
    setSelectedWardDetail(ward);
    setActiveModal('ward_detail');
  };

  const handleIssueNotice = (wardName) => {
    setActiveModal(null);
    notify(`⚡ Executive Directive dispatched to Assistant Commissioner (${wardName}) with 24h compliance mandate.`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Executive Command Deck (ALL CARDS ARE CLICKABLE WITH HOVER GLOW) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* 1. Civic Health Index Card */}
        <div
          onClick={() => setActiveModal('health_index')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/60 p-5 rounded-3xl cursor-pointer transition shadow-xl group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs text-blue-300 font-semibold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-400 group-hover:animate-pulse" /> City Health Index
            </span>
            <span className="text-[9px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-mono">Inspect ↗</span>
          </div>
          <h3 className="text-3xl font-black text-white font-mono mt-2">88.4%</h3>
          <p className="text-[10px] text-emerald-400 mt-1">▲ Optimal Municipal Velocity</p>
        </div>

        {/* 2. Total Intake Card */}
        <div
          onClick={() => setActiveModal('intake')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 p-5 rounded-3xl cursor-pointer transition shadow-xl group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-slate-400" /> Total City Intake
            </span>
            <span className="text-[9px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">Inspect ↗</span>
          </div>
          <h3 className="text-3xl font-black text-white font-mono mt-2">{totalComplaints}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Across 6 Bhosari Prabhags</p>
        </div>

        {/* 3. Resolved Complaints Card */}
        <div
          onClick={() => setActiveModal('resolved')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/60 p-5 rounded-3xl cursor-pointer transition shadow-xl group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resolved Issues
            </span>
            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">Inspect ↗</span>
          </div>
          <h3 className="text-3xl font-black text-emerald-400 font-mono mt-2">{totalResolved}</h3>
          <p className="text-[10px] text-emerald-400 mt-1">
            {totalComplaints > 0 ? ((totalResolved / totalComplaints) * 100).toFixed(1) : 0}% City Resolution Rate
          </p>
        </div>

        {/* 4. Actionable SLA Breach Risk Card (HIGHLIGHTED FEATURE) */}
        <div
          onClick={() => setActiveModal('sla_risk')}
          className="bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/50 hover:border-rose-400 p-5 rounded-3xl cursor-pointer transition shadow-2xl relative overflow-hidden group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs text-rose-300 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" /> SLA Breach Risk
            </span>
            <span className="text-[9px] text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded font-mono font-bold border border-rose-500/30">
              Action ⚡
            </span>
          </div>
          <h3 className="text-2xl font-black text-rose-400 font-mono mt-2">1 Ward at Risk</h3>
          <p className="text-[10px] text-rose-300/90 mt-1 font-semibold">
            Prabhag 06 (Chikhali) • Click for Dossier ↗
          </p>
        </div>
      </div>

      {/* City-Wide GIS Incident Heatmap */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Bhosari (AC 207) • Real-Time GIS Incident Distribution
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Interactive PCMC Incident Map</span>
        </div>
        <CivicMap issues={issues} center={[18.6298, 73.8477]} zoom={13} />
      </div>

      {/* Jurisdiction & Area Division Hierarchy */}
      <JurisdictionExplorer wards={wards} />

      {/* Official Ward Civic Performance Index (WCPI) Leaderboard (Clickable Wards) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Trophy className="text-amber-400 w-5 h-5" /> Ward Civic Performance Index (WCPI) Leaderboard
            </h3>
            <p className="text-xs text-slate-400">
              Click any Prabhag card to inspect detailed operational diagnostics, covered localities & backlog logs
            </p>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-mono font-bold">
            Executive View
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {wards.map((w, index) => (
            <div
              key={w.wardId}
              onClick={() => openWardModal(w)}
              className={`p-5 rounded-2xl border space-y-3 cursor-pointer transition hover:scale-[1.01] ${
                index === 0
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-lg hover:border-amber-400'
                  : w.wcpiScore < 65
                  ? 'bg-rose-950/20 border-rose-500/50 hover:border-rose-400'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-black font-mono ${index === 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    #{index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {w.wardName}
                    </h4>
                    <p className="text-xs text-slate-400">{w.assistantCommissioner} • {w.zone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-emerald-400">{w.wcpiScore}</span>
                  <span className="text-[10px] text-slate-500 block">WCPI Score</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Resolved:</span>
                  <p className="font-bold text-white">{w.totalResolved}/{w.totalReported}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Avg Days:</span>
                  <p className="font-bold text-white">{w.avgResolutionDays}d</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Recurrence:</span>
                  <p className="font-bold text-rose-400">{w.recurrenceRate}%</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 flex justify-between items-center">
                <span className="truncate max-w-[80%]">
                  <span className="text-amber-400 font-semibold">AI Diagnostic: </span>{w.aiDiagnostic}
                </span>
                <span className="text-blue-400 text-[10px] font-mono shrink-0">Details ↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 ACTIONABLE DRILLDOWN MODALS                                            */}
      {/* ========================================================================= */}

      {/* 1. SLA BREACH RISK DOSSIER MODAL */}
      {activeModal === 'sla_risk' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/60 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">SLA Risk Escalation Dossier</h3>
                  <p className="text-xs text-rose-300 font-mono">Actionable Municipal Intervention Sheet</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ward at Risk Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded">
                  ZONE F • BHOSARI AC 207
                </span>
                <span className="text-xs text-rose-400 font-bold font-mono">SLA Adherence: 66% (CRITICAL)</span>
              </div>
              <h4 className="text-base font-bold text-white">Prabhag 06 - Chikhali / Jadhavwadi / Kudalwadi</h4>
              <p className="text-xs text-slate-400">Assistant Commissioner: <span className="text-slate-200 font-semibold">Mr. Umesh Patil</span></p>

              {/* Counts */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Approaching SLA (&lt; 6 hrs):</span>
                  <p className="text-xl font-black text-amber-400 font-mono mt-0.5">12 Complaints</p>
                </div>
                <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Already Breached (&gt; 48 hrs):</span>
                  <p className="text-xl font-black text-rose-400 font-mono mt-0.5">3 Complaints</p>
                </div>
              </div>
            </div>

            {/* Departments Affected */}
            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Departments Affected:</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">• Civil & Road Dept</span>
                  <span className="text-rose-400 font-mono font-bold">7 Delayed</span>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">• Drainage & Sewerage</span>
                  <span className="text-amber-400 font-mono font-bold">5 Approaching</span>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">• Solid Waste (SWM)</span>
                  <span className="text-amber-400 font-mono font-bold">3 Approaching</span>
                </div>
              </div>
            </div>

            {/* Highest Priority Hazard */}
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                Highest Priority Hazard Requiring Immediate Resolution
              </span>
              <p className="font-bold text-white">
                {highestPriorityIssue?.category || 'Pothole (खड्डा)'} — <span className="text-rose-400">Score: {highestPriorityIssue?.priorityScore || 95}/100 (High)</span>
              </p>
              <p className="text-[11px] text-slate-300">📍 {highestPriorityIssue?.locationName || 'Near Spine Road Exhibition Corridor'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleIssueNotice('Prabhag 06 - Chikhali')}
                className="w-2/3 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                <Send className="w-3.5 h-3.5" /> Issue 24h Executive Notice ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CIVIC HEALTH INDEX DECOMPOSITION MODAL */}
      {activeModal === 'health_index' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-blue-500/60 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">City Civic Health Index (88.4%)</h3>
                <p className="text-xs text-blue-300">Mathematical Index Factor Decomposition</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">1. SLA Compliance Velocity (35% Weight)</p>
                  <p className="text-[11px] text-slate-400">89.0% of complaints resolved within 48h SLA</p>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-sm">91.2 / 100</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">2. Intake vs. Resolution Ratio (40% Weight)</p>
                  <p className="text-[11px] text-slate-400">Burn-down rate: 128 Resolved / 146 Registered</p>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-sm">87.6 / 100</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">3. Defect Recurrence Penalty (15% Weight)</p>
                  <p className="text-[11px] text-slate-400">Only 3.2% of road patches resurfaced within 60 days</p>
                </div>
                <span className="text-amber-400 font-mono font-bold text-sm">94.8 / 100</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">4. Critical Hazard Mitigation Velocity (10% Weight)</p>
                  <p className="text-[11px] text-slate-400">Average response to open manholes: 4.2 hours</p>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-sm">96.0 / 100</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. TOTAL INTAKE & DEPARTMENT MATRIX MODAL */}
      {activeModal === 'intake' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">City Intake Breakdown ({totalComplaints} Reports)</h3>
                <p className="text-xs text-slate-400">Distribution by Department & Priority</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-white">🛣️ PCMC Civil & Road Maintenance Dept</span>
                <span className="font-mono text-amber-400 font-bold">42% (78 Issues)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-white">💧 PCMC Drainage & Sewerage Dept</span>
                <span className="font-mono text-blue-400 font-bold">28% (52 Issues)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-white">🗑️ PCMC Health & Solid Waste (SWM)</span>
                <span className="font-mono text-emerald-400 font-bold">18% (33 Issues)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-white">💡 PCMC Electrical & Lighting Dept</span>
                <span className="font-mono text-purple-400 font-bold">12% (22 Issues)</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-bold"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {/* 4. RESOLVED QUALITY AUDIT MODAL */}
      {activeModal === 'resolved' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">Resolution Quality & Verification Audit</h3>
                <p className="text-xs text-emerald-300">Verified by AI Change-Detection Model</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Average AI Verification Match Score:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">95.4% Confirmed</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Citizen Satisfaction Rating:</span>
                <span className="font-mono text-amber-400 font-bold text-sm">4.3 / 5.0 (⭐)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Contractor Rework Rejection Rate:</span>
                <span className="font-mono text-blue-400 font-bold text-sm">3.8% (Demanded Rework)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Mean Time to Resolve (MTTR):</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">2.1 Days</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold"
            >
              Close Audit
            </button>
          </div>
        </div>
      )}

      {/* 5. INDIVIDUAL WARD TELEMETRY DRILLDOWN MODAL */}
      {activeModal === 'ward_detail' && selectedWardDetail && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider bg-amber-950 px-2 py-0.5 rounded">
                  {selectedWardDetail.zone} • {selectedWardDetail.wardId}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{selectedWardDetail.wardName}</h3>
                <p className="text-xs text-slate-400">{selectedWardDetail.assistantCommissioner}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Covered Area</span>
                <span className="font-bold text-white font-mono">{selectedWardDetail.areaSqKm} km²</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Population</span>
                <span className="font-bold text-white font-mono">{selectedWardDetail.population.toLocaleString()}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">WCPI Score</span>
                <span className="font-bold text-emerald-400 font-mono">{selectedWardDetail.wcpiScore} pts</span>
              </div>
            </div>

            {/* Covered Localities */}
            <div className="space-y-1.5 text-xs">
              <h5 className="font-bold text-slate-300 text-[11px]">Covered Localities & Sectors:</h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedWardDetail.localitiesCovered?.map((loc, i) => (
                  <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Diagnostic Alert */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-amber-400 font-semibold block mb-0.5">AI Operational Diagnostic:</span>
              {selectedWardDetail.aiDiagnostic}
            </div>

            {/* Zonal Office & Helpline */}
            <div className="p-3 bg-slate-800/60 rounded-xl flex justify-between items-center text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Office Location:</p>
                <p className="text-slate-200 text-[11px] font-medium truncate max-w-[240px]">{selectedWardDetail.officeAddress}</p>
              </div>
              <a
                href={`tel:${selectedWardDetail.emergencyHelpline}`}
                className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 px-3 py-1.5 rounded-lg font-mono text-[11px] flex items-center gap-1 font-bold transition"
              >
                <Phone className="w-3 h-3" /> {selectedWardDetail.emergencyHelpline}
              </a>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-bold"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}