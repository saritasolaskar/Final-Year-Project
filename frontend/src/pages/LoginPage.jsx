import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'commissioner') navigate('/commissioner');
      else if (user.role === 'ward_officer') navigate('/ward-officer');
      else if (user.role === 'worker') navigate('/worker');
      else navigate('/citizen');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid PCMC / Bhosari Credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Landmark className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white">पिंपरी चिंचवड महानगरपालिका</h2>
          <p className="text-xs text-amber-400 font-bold">Bhosari Constituency (AC 207) • CivicAI</p>
          <p className="text-[11px] text-slate-400 font-mono">PCMC Smart Sarathi Decision System</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">PCMC Official ID / Resident Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@pcmcindia.gov.in or citizen@demo.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
          >
            {loading ? 'Authenticating with PCMC Servers...' : 'Sign In to PCMC Portal →'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-slate-400">
            Bhosari Resident without an account?{' '}
            <Link to="/register" className="text-amber-400 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Quick Demo Credentials for Bhosari Presentation */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider text-center">Bhosari AC 207 Demo Logins</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => fillDemo('commissioner@pcmcindia.gov.in', 'pcmcadmin123')}
              className="p-2.5 bg-slate-800/60 hover:bg-slate-800 text-amber-300 rounded-xl border border-slate-700 text-left"
            >
              🏛️ PCMC Commissioner
            </button>
            <button
              onClick={() => fillDemo('ward.bhosari@pcmcindia.gov.in', 'bhosari123')}
              className="p-2.5 bg-slate-800/60 hover:bg-slate-800 text-purple-300 rounded-xl border border-slate-700 text-left"
            >
              🏢 Bhosari Ward Officer
            </button>
            <button
              onClick={() => fillDemo('worker.bhosari@pcmcindia.gov.in', 'worker123')}
              className="p-2.5 bg-slate-800/60 hover:bg-slate-800 text-emerald-300 rounded-xl border border-slate-700 text-left"
            >
              👷 Bhosari Road Crew Lead
            </button>
            <button
              onClick={() => fillDemo('citizen.bhosari@demo.com', 'citizen123')}
              className="p-2.5 bg-slate-800/60 hover:bg-slate-800 text-blue-300 rounded-xl border border-slate-700 text-left"
            >
              👤 Bhosari Resident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}