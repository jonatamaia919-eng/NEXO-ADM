
import React, { useState } from 'react';
import { User } from '../../types';
import { storageService } from '../../services/storageService';
import { Button } from '../Shared/Button';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = storageService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        if (!user.active) {
          setError('Acesso temporariamente suspenso. Contate o administrador.');
          setLoading(false);
          return;
        }
        onLoginSuccess(user);
      } else {
        setError('E-mail ou chave de segurança incorretos.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background aesthetics using variables */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary-bg)] rounded-full blur-[150px] opacity-60"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--primary-bg)] rounded-full blur-[150px] opacity-40"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        {onBack && (
          <button 
            onClick={onBack} 
            className="mb-10 flex items-center gap-3 text-slate-400 hover:text-custom-primary font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Voltar ao Início
          </button>
        )}

        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-custom-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-100">
            <i className="fa-solid fa-bolt text-white text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Login Seguro</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Identidade Digital Nexo</p>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
                <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-2">E-mail Credenciado</label>
              <div className="relative group">
                <i className="fa-solid fa-user absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-custom-primary transition-colors"></i>
                <input 
                  required
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full pl-14 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-custom-primary focus:bg-white rounded-[1.5rem] outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 shadow-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-2">Chave de Segurança</label>
              <div className="relative group">
                <i className="fa-solid fa-key absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-custom-primary transition-colors"></i>
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-custom-primary focus:bg-white rounded-[1.5rem] outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 shadow-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full h-20 rounded-[1.75rem] font-black text-xl shadow-2xl shadow-indigo-100 mt-6 active:scale-[0.98]"
            >
              Autenticar
            </Button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
            Sistema de Acesso Restrito <br />
            <span className="text-slate-900">Criptografia de Ponta a Ponta</span>
          </p>
        </div>
      </div>
    </div>
  );
};
