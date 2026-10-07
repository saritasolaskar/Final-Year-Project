import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Landmark, LogOut, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'commissioner': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'ward_officer': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'worker': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* PCMC Bhosari AC 207 Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 font-bold">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">
                CivicAI • Bhosari (AC 207)
              </h1>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700 hidden sm:inline-block">
                पिंपरी चिंचवड महानगरपालिका (PCMC)
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono tracking-wider">
              BHOSARI CONSTITUENCY & PCMC AUTONOMOUS DECISION PLATFORM
            </p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono uppercase ${getRoleBadge(user.role)}`}>
                {user.role.replace('_', ' ')} • {user.ward}
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <PhoneCall className="w-3.5 h-3.5" /> PCMC Smart Sarathi: 1800 1030 222
          </div>
        )}
      </div>
    </header>
  );
}