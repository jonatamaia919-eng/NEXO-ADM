
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
        setError('Acesso não autorizado: Verifique e-mail e senha.');
        setIsLoading(false);
      } else if (!user.active) {
        setError('Atenção: Seu usuário foi desativado pelo administrador.');
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
      const isFixedAdmin = (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) || (email === "admin@nexo.com" && password === "admin123");

      if (isFixedAdmin || dbAdmin) {
        storageService.setAdminSession(true);
        setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
        setIsLoading(false);
        setEmail('');
        setPassword('');
      } else {
        setError('Credenciais administrativas inválidas.');
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

  // LANDING PAGE (TEMA CLARO - TEXTO PRETO)
  if (currentRoute === AppRoute.SWITCHER) {
    return (
      <div className="min-h-screen bg-white text-slate-950 selection:bg-indigo-100 overflow-x-hidden font-sans">
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-bolt text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">NEXO</span>
          </div>
          <div className="hidden md:flex gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Soluções</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Segurança</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Carreiras</a>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setCurrentRoute(AppRoute.ADMIN_LOGIN)}
              className="hidden sm:block text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              Admin
            </button>
            <Button variant="primary" size="md" className="rounded-xl px-6 font-bold" onClick={() => setCurrentRoute(AppRoute.APP_LOGIN)}>
              Entrar na Conta
            </Button>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-extrabold mb-8 tracking-wider uppercase">
              <i className="fa-solid fa-star"></i>
              Líder em Gestão Financeira Digital
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter text-slate-900">
              Controle seu <br />
              <span className="text-indigo-600">Patrimônio.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              O ecossistema Nexo combina inteligência analítica com uma interface intuitiva para você dominar suas finanças de uma vez por todas.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Button variant="primary" size="lg" className="h-16 px-10 text-xl font-black rounded-2xl shadow-xl shadow-indigo-200" onClick={() => setCurrentRoute(AppRoute.APP_LOGIN)}>
                Começar Grátis
              </Button>
              <Button variant="ghost" size="lg" className="h-16 px-10 text-xl font-bold border border-slate-200 hover:bg-slate-50 rounded-2xl text-slate-700">
                Ver Demonstração
              </Button>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
            <div className="relative bg-white border border-slate-200 p-4 rounded-[3rem] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                alt="Nexo Interface" 
                className="rounded-[2.5rem] shadow-inner"
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // LOGIN SCREENS
  if (currentRoute === AppRoute.APP_LOGIN || currentRoute === AppRoute.ADMIN_LOGIN) {
    const isAdmin = currentRoute === AppRoute.ADMIN_LOGIN;
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 bg-slate-50`}>
        <div className="max-w-md w-full p-10 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <button onClick={() => setCurrentRoute(AppRoute.SWITCHER)} className="mb-8 text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            Início
          </button>
          
          <div className="text-center mb-10">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-xl ${isAdmin ? 'bg-slate-900' : 'bg-indigo-600'}`}>
              <i className={`fa-solid ${isAdmin ? 'fa-shield-halved' : 'fa-user'} text-4xl text-white`}></i>
            </div>
            <h1 className="text-3xl font-black mb-3 tracking-tighter text-slate-900">{isAdmin ? 'Nexo Admin' : 'Bem-vindo'}</h1>
            <p className="text-sm font-medium text-slate-500">
              {isAdmin ? 'Portal de controle para administradores.' : 'Acesse seu painel financeiro.'}
            </p>
          </div>

          <form onSubmit={isAdmin ? handleAdminLogin : handleUserLogin} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-3 border border-rose-100">
                <i className="fa-solid fa-circle-exclamation text-base"></i>
                {error}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-700">Endereço de E-mail</label>
              <input 
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isAdmin ? "admin@nexo.com" : "seu@email.com"}
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-transparent text-slate-950 focus:ring-2 focus:ring-indigo-600 transition-all font-bold outline-none placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-700">Senha de Acesso</label>
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-transparent text-slate-950 focus:ring-2 focus:ring-indigo-600 transition-all font-bold outline-none placeholder:text-slate-400"
              />
            </div>
            
            <Button variant={isAdmin ? 'secondary' : 'primary'} size="lg" className={`w-full h-16 mt-4 text-lg font-black rounded-2xl shadow-xl ${isAdmin ? 'bg-slate-900 text-white hover:bg-black' : 'shadow-indigo-100'}`} loading={isLoading}>
              {isAdmin ? 'Acessar Console' : 'Entrar Agora'}
            </Button>
          </form>
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
