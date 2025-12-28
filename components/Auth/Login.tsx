
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

    // Simulação pequena de delay para UX
    setTimeout(() => {
      const users = storageService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        if (!user.active) {
          setError('Acesso desativado. Entre em contato com o suporte.');
          setLoading(false);
          return;
        }
        onLoginSuccess(user);
      } else {
        setError('Credenciais inválidas. Verifique e tente novamente.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos visuais de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-md relative z-10">
        {onBack && (
          <button 
            onClick={onBack} 
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-purple-600 font-black text-xs uppercase tracking-widest transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i> Voltar ao Início
          </button>
        )}

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-200">
            <i className="fa-solid fa-bolt text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">NEXO</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Ecossistema Financeiro Fechado</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in zoom-in duration-500">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Acesso Autorizado</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  required
                  type="email"
                  placeholder="Seu e-mail"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-purple-600 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Chave de Segurança</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  required
                  type="password"
                  placeholder="Sua senha"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-purple-600 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full h-16 bg-purple-600 hover:bg-purple-700 rounded-2xl font-black text-lg shadow-xl shadow-purple-200 mt-4"
            >
              Entrar no App
            </Button>
          </form>
        </div>

        <p className="mt-10 text-center text-slate-400 text-xs font-medium">
          Esqueceu seu acesso? <br />
          <span className="text-slate-900 font-bold">Solicite ao seu administrador.</span>
        </p>
      </div>
    </div>
  );
};
