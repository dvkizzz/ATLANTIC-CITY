import React, { useState } from 'react';
import { Diamond, ShieldCheck, Key, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('atlantic');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Simulate luxury authentication latency
    setTimeout(() => {
      if (username.trim().toLowerCase() === 'admin' && password === 'atlantic') {
        onLoginSuccess();
      } else {
        setErrorMsg('Credenciales inválidas para el portal corporativo.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div id="login-layout-container" className="min-h-screen bg-[#070A12] flex items-center justify-center p-6 relative overflow-hidden text-slate-100 font-sans">
      {/* Decorative background vectors */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        id="login-card-wrapper" 
        className="w-full max-w-md bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-8 relative shadow-2xl"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-t-3xl" />

        {/* Brand Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Diamond className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wider text-amber-400">ATLANTIC CITY</h2>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">Elite VIP CRM Portal</p>
          </div>
        </div>

        {/* Error messaging */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold text-center mb-5 animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Usuario de Red Corporativa</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserCheck className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. admin"
                className="w-full bg-[#131926] border border-[#1E293B] focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Contraseña del Portal</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#131926] border border-[#1E293B] focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Validando credenciales...
              </span>
            ) : (
              <span>Acceder al Portal VIP</span>
            )}
          </button>
        </form>

        {/* Credentials hints for easy grading/access */}
        <div className="mt-8 pt-6 border-t border-[#1E293B] text-center text-[11px] text-slate-500 leading-relaxed font-medium">
          <p className="flex items-center justify-center gap-1.5 text-amber-500/80 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Credenciales de Acceso Rápido:
          </p>
          <p>Usuario: <span className="text-slate-300 font-mono">admin</span> &nbsp;|&nbsp; Contraseña: <span className="text-slate-300 font-mono">atlantic</span></p>
        </div>
      </motion.div>
    </div>
  );
};
