import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { useAuth } from '../context/AuthContext';
import {
  Navigation,
  Camera,
  HardHat,
  AlertOctagon,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { issues, updateIssue, notify } = useCivic();
  const [selectedTask, setSelectedTask] = useState(issues[0] || null);
  const [verifying, setVerifying] = useState(false);
  const [blockerModal, setBlockerModal] = useState(false);
  const [blockerText, setBlockerText] = useState('');

  const handleStart = (id) => {
    updateIssue(id, { status: 'In-Progress' });
    notify(`Task ${id} marked as In-Progress.`);
  };

  const handleUploadProof = (id) => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      updateIssue(id, {
        afterImageUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
      });
      notify('🤖 AI Verification Complete: Repair proof submitted for Ward Officer sign-off.');
    }, 1500);
  };

  const submitBlocker = (id) => {
    updateIssue(id, { blockerReason: blockerText });
    setBlockerModal(false);
    setBlockerText('');
    notify('⚠️ On-ground blocker reported to Junior Engineer.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Shift Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400">{user?.department} • {user?.ward}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-mono">
            ● Active Shift
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Task Queue */}
        <div className="md:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Assigned Tasks</h3>
          {issues.length === 0 ? (
            <p className="text-xs text-slate-500 p-4">No tasks assigned currently.</p>
          ) : (
            issues.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                  selectedTask?.id === task.id
                    ? 'bg-slate-800 border-amber-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">{task.category}</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                    Score: {task.priorityScore}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{task.locationName}</p>
                <div className="mt-2 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-mono">{task.id}</span>
                  <span className="text-amber-400 font-semibold">{task.status}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Execution Card */}
        <div className="md:col-span-2">
          {selectedTask ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedTask.id} • SLA: {selectedTask.slaTargetHours}h</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedTask.category}</h3>
                  <p className="text-xs text-slate-400">{selectedTask.locationName}</p>
                </div>
                <a
                  href={`https://maps.google.com/?q=${selectedTask.latitude},${selectedTask.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" /> GPS Navigation
                </a>
              </div>

              {/* JE Technical Directive Box */}
              {selectedTask.specialInstructions && (
                <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-2xl text-xs space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Junior Engineer (JE) Field Directive
                  </span>
                  <p className="text-slate-200 font-medium">"{selectedTask.specialInstructions}"</p>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">Original Citizen Photograph (Before)</span>
                <img src={selectedTask.beforeImageUrl} alt="Before" className="w-full h-48 object-cover rounded-2xl border border-slate-800" />
              </div>

              {/* Action Controls */}
              <div className="space-y-3 pt-2">
                {selectedTask.status === 'Assigned' || selectedTask.status === 'Reported' ? (
                  <button
                    onClick={() => handleStart(selectedTask.id)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-blue-600/20"
                  >
                    Start Work (Mark In-Progress) ⚡
                  </button>
                ) : selectedTask.status === 'In-Progress' ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUploadProof(selectedTask.id)}
                      disabled={verifying}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <Camera className="w-4 h-4" />
                      {verifying ? 'AI Change Detection Running...' : 'Upload After-Repair Proof Photo'}
                    </button>
                    <button
                      onClick={() => setBlockerModal(true)}
                      className="w-full bg-slate-800 hover:bg-rose-950/40 text-rose-300 border border-rose-800/40 font-semibold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" /> Report On-Ground Blocker
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-purple-950/40 border border-purple-800 rounded-2xl text-center">
                    <span className="text-xs font-bold text-purple-300">
                      ✨ Verification Submitted (AI Match: {selectedTask.aiVerificationScore || 94.2}%)
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">Awaiting Ward Officer final sign-off</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">Select a task from the list.</div>
          )}
        </div>
      </div>

      {/* Blocker Modal */}
      {blockerModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertOctagon className="text-rose-400 w-4 h-4" /> Report On-Ground Blocker
            </h3>
            <textarea
              rows={3}
              value={blockerText}
              onChange={(e) => setBlockerText(e.target.value)}
              placeholder="e.g. Traffic clearance needed, heavy machinery required..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex gap-2">
              <button onClick={() => setBlockerModal(false)} className="w-1/2 bg-slate-800 py-2 rounded-xl text-xs text-slate-300 font-semibold">Cancel</button>
              <button onClick={() => submitBlocker(selectedTask.id)} className="w-1/2 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-xl text-xs font-bold">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}