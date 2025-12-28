
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from './types';
import { storageService } from './services/storageService';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './constants';
import { AppDashboard } from './components/App/AppDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Button } from './components/Shared/Button';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.SWITCHER);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Auth Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const userSession = storageService.getSession();
    const isAdmin = storageService.getAdminSession();

    if (userSession) {
      setCurrentUser(userSession);
      setCurrentRoute(AppRoute.APP_DASHBOARD);
    } else if (isAdmin) {
      setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
    }
  }, []);

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const users = storageService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        setError('Acesso não autorizado');
        setIsLoading(false);
      } else if (!user.active) {
        setError('Usuário desativado');
        setIsLoading(false);
      } else {
        storageService.setSession(user);
        setCurrentUser(user);
        setCurrentRoute(AppRoute.APP_DASHBOARD);
        setIsLoading(false);
        setEmail('');
        setPassword('');
      }
    }, 800);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const users = storageService.getUsers();
      const dbAdmin = users.find(u => u.email === email && u.password === password && u.role === 'admin' && u.active);
      const isFixedAdmin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;

      if (isFixedAdmin || dbAdmin) {
        storageService.setAdminSession(true);
        setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
        setIsLoading(false);
        setEmail('');
        setPassword('');
      } else {
        setError('Credenciais administrativas incorretas ou acesso negado');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleLogout = () => {
    storageService.clearSession();
    storageService.setAdminSession(false);
    setCurrentUser(null);
    setCurrentRoute(AppRoute.SWITCHER);
    setError('');
  };

  if (currentRoute === AppRoute.SWITCHER) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:border-indigo-500/50">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
              <i className="fa-solid fa-bolt text-3xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nexo App</h2>
            <p className="text-slate-400 mb-8 text-sm">Acesse sua carteira digital, acompanhe seus gastos e gerencie seus investimentos.</p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => setCurrentRoute(AppRoute.APP_LOGIN)}>
              Entrar como Usuário
            </Button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:border-slate-400/50">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/20">
              <i className="fa-solid fa-shield-halved text-3xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nexo Admin</h2>
            <p className="text-slate-400 mb-8 text-sm">Portal administrativo para gerenciamento de usuários, segurança e configurações globais.</p>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => setCurrentRoute(AppRoute.ADMIN_LOGIN)}>
              Painel Administrativo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentRoute === AppRoute.APP_LOGIN || currentRoute === AppRoute.ADMIN_LOGIN) {
    const isAdmin = currentRoute === AppRoute.ADMIN_LOGIN;
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isAdmin ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${isAdmin ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
          <button onClick={() => setCurrentRoute(AppRoute.SWITCHER)} className="mb-6 text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            Voltar
          </button>
          
          <div className="text-center mb-10">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isAdmin ? 'bg-indigo-600' : 'bg-indigo-600 shadow-xl shadow-indigo-500/20'}`}>
              <i className={`fa-solid ${isAdmin ? 'fa-lock' : 'fa-bolt'} text-3xl text-white`}></i>
            </div>
            <h1 className="text-2xl font-bold mb-2">{isAdmin ? 'Nexo Admin' : 'Bem-vindo ao NEXO'}</h1>
            <p className={`text-sm ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>
              {isAdmin ? 'Insira suas credenciais de acesso restrito.' : 'Entre na sua conta para gerenciar suas finanças.'}
            </p>
          </div>

          <form onSubmit={isAdmin ? handleAdminLogin : handleUserLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2 border border-rose-100 animate-shake">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>E-mail</label>
              <input 
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isAdmin ? 'admin@nexo.com' : 'seu@email.com'}
                className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 transition-all ${isAdmin ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:ring-indigo-500'}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>Senha</label>
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
                className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 transition-all ${isAdmin ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:ring-indigo-500'}`}
              />
            </div>
            
            {!isAdmin && (
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  Lembrar-me
                </label>
                <a href="#" className="text-indigo-600 font-bold hover:underline">Esqueci minha senha</a>
              </div>
            )}

            <Button variant="primary" size="lg" className="w-full h-12 mt-4" loading={isLoading}>
              Entrar
            </Button>
          </form>

          {isAdmin && (
            <p className="mt-8 text-center text-[10px] text-slate-500 uppercase tracking-widest">
              Acesso exclusivo para funcionários autorizados.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (currentRoute === AppRoute.APP_DASHBOARD && currentUser) {
    return <AppDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentRoute === AppRoute.ADMIN_DASHBOARD) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return null;
};

export default App;
