import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { useAuth } from '../context/AuthContext';
import { Camera, Trophy } from 'lucide-react';
import JurisdictionExplorer from '../components/JurisdictionExplorer';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { issues, wards, createIssue, updateIssue, notify, loading } = useCivic();
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [notes, setNotes] = useState('');

  const triggerCameraScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAiResult({
        category: 'Pothole',
        department: 'Roads & Infrastructure',
        confidence: 96.4,
        severity: 'High',
        location: 'MG Road Arterial Corridor',
        lat: 18.5204,
        lng: 73.8567,
        img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      });
    }, 1200);
  };

  const handleReport = (e) => {
    e.preventDefault();
    createIssue({
      latitude: aiResult.lat,
      longitude: aiResult.lng,
      locationName: aiResult.location,
      citizenNotes: notes,
      imageBase64OrUrl: aiResult.img,
    });
    setAiResult(null);
    setNotes('');
  };

  const handleRateFix = (ticketId, stars) => {
    updateIssue(ticketId, { citizenRating: stars });
    notify(`⭐ Thank you! Feedback rating of ${stars} stars recorded.`);
  };

  const handleDispute = (ticketId) => {
    updateIssue(ticketId, { status: 'Disputed', citizenFeedback: 'Citizen disputed repair quality. Re-opened for Ward inspection.' });
    notify('⚠️ Complaint re-opened and flagged for Ward Officer quality re-inspection.');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/40 to-slate-900 border border-blue-800/40 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/30">
            Citizen Public Portal
          </span>
          <h2 className="text-xl font-black text-white mt-2">Welcome, {user?.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Jurisdiction: <span className="font-semibold text-white">{user?.ward}</span> • GPS Geofenced Reporting Active
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Snap & Report Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="text-blue-400 w-4 h-4" /> Instant AI Issue Intake
            </h3>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">
              Zero Long Forms
            </span>
          </div>

          {!aiResult ? (
            <div
              onClick={triggerCameraScan}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-800/40 hover:bg-slate-800/80"
            >
              {analyzing ? (
                <div className="py-4 space-y-2">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-blue-400 font-mono">Running YOLO Model Inference & Geofence Validation...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    📷
                  </div>
                  <p className="text-sm font-bold text-slate-200">Snap Photo or Upload</p>
                  <p className="text-[11px] text-slate-400">AI automatically detects category, severity & department</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleReport} className="space-y-4">
              <div className="bg-blue-950/40 border border-blue-600/40 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-white">{aiResult.category}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                    {aiResult.confidence}% AI Match
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Department</span>
                    <span className="font-semibold text-white">{aiResult.department}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Severity Tier</span>
                    <span className="font-bold text-rose-400">{aiResult.severity}</span>
                  </div>
                </div>
              </div>

              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional landmark notes (e.g., Near Bus Stand)..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAiResult(null)}
                  className="w-1/3 bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-semibold"
                >
                  Retake
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition"
                >
                  Submit Complaint ⚡
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Public Ward Civic Performance Index (WCPI) Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="text-amber-400 w-4 h-4" /> Ward Civic Performance Index (WCPI)
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded font-mono font-bold">
              Public Accountability
            </span>
          </div>

          <div className="space-y-3">
            {wards && wards.map((w, idx) => (
              <div
                key={w.wardId}
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  idx === 0
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-md'
                    : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-base font-black font-mono ${idx === 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{w.wardName}</h4>
                    <p className="text-[10px] text-slate-400">Head: {w.assistantCommissioner} • {w.zone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-emerald-400">{w.wcpiScore} pts</span>
                  <p className="text-[10px] text-slate-500">{w.totalResolved}/{w.totalReported} Solved ({w.totalReported > 0 ? ((w.totalResolved/w.totalReported)*100).toFixed(0) : 0}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jurisdiction & Area Division Explorer Component */}
      <JurisdictionExplorer wards={wards} />

      {/* Citizen's Reported Complaints Hub with Before vs After and Dispute Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">My Active Complaints & Resolution Audit</h3>
        {issues.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">You have not submitted any complaints yet.</p>
        ) : (
          <div className="space-y-4">
            {issues.map((item) => (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-[9px] text-slate-500 block mb-1 font-mono">BEFORE</span>
                    <img src={item.beforeImageUrl} alt="Before" className="w-16 h-16 object-cover rounded-xl border border-slate-700" />
                  </div>
                  {item.afterImageUrl && (
                    <div className="text-center">
                      <span className="text-[9px] text-emerald-400 block mb-1 font-mono">AFTER FIX</span>
                      <img src={item.afterImageUrl} alt="After" className="w-16 h-16 object-cover rounded-xl border border-emerald-600" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.category}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      {item.isUnderContractorWarranty && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">DLP Warranty</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{item.locationName}</p>
                    <p className="text-[10px] text-blue-400 font-medium">Assigned Team: {item.assignedWorkerName}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    item.status === 'Closed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'Disputed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    item.status === 'In-Progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.status === 'Closed' ? '✅ Resolved & Verified' : item.status}
                  </span>

                  {/* Citizen Satisfaction Stars & Dispute button when Closed */}
                  {item.status === 'Closed' && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateFix(item.id, star)}
                            className={`text-sm ${
                              (item.citizenRating || 0) >= star ? 'text-amber-400' : 'text-slate-600'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleDispute(item.id)}
                        className="text-[10px] bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-2 py-1 rounded-lg border border-rose-600/40 transition"
                      >
                        Dispute Fix
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}