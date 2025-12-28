
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
      // Check for user in DB with admin role OR fixed credentials
      const dbAdmin = users.find(u => u.email === email && u.password === password && u.role === 'admin' && u.active);
      const isFixedAdmin = (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) || (email === "admin@nexo.com" && password === "admin123");

      if (isFixedAdmin || dbAdmin) {
        storageService.setAdminSession(true);
        setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
        setIsLoading(false);
        setEmail('');
        setPassword('');
      } else {
        setError('Credenciais administrativas incorretas');
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

  // LANDING PAGE COMPONENT (SWITCHER)
  if (currentRoute === AppRoute.SWITCHER) {
    return (
      <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
        {/* Animated Background Decor */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fa-solid fa-bolt text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter">NEXO</span>
          </div>
          <div className="hidden md:flex gap-10 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <a href="#security" className="hover:text-white transition-colors">Segurança</a>
            <a href="#about" className="hover:text-white transition-colors">Sobre</a>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentRoute(AppRoute.ADMIN_LOGIN)}
              className="hidden sm:block text-xs font-bold text-slate-400 hover:text-white transition-colors px-4 py-2 uppercase tracking-widest"
            >
              Console Admin
            </button>
            <Button variant="primary" size="md" className="rounded-xl px-6 font-bold" onClick={() => setCurrentRoute(AppRoute.APP_LOGIN)}>
              Entrar
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-extrabold mb-8 tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              V 2.5.0 • Disponível para Acesso
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
              Domine seu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 animate-gradient">Dinheiro.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              O ecossistema financeiro definitivo para quem exige alta performance, 
              controle granular e segurança inabalável. Tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Button variant="primary" size="lg" className="h-16 px-10 text-xl font-black rounded-2xl shadow-2xl shadow-indigo-500/40" onClick={() => setCurrentRoute(AppRoute.APP_LOGIN)}>
                Começar Jornada
                <i className="fa-solid fa-chevron-right ml-3 text-sm"></i>
              </Button>
              <Button variant="ghost" size="lg" className="h-16 px-10 text-xl font-bold border border-white/10 hover:bg-white/5 rounded-2xl">
                Demo Grátis
              </Button>
            </div>
            
            <div className="mt-16 pt-16 border-t border-white/5 flex flex-wrap justify-center lg:justify-start gap-12 opacity-30">
              <i className="fa-brands fa-stripe text-5xl"></i>
              <i className="fa-brands fa-apple-pay text-5xl"></i>
              <i className="fa-brands fa-cc-visa text-5xl"></i>
              <i className="fa-brands fa-cc-mastercard text-5xl"></i>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000">
            {/* Mockup Frame */}
            <div className="relative bg-slate-900 border border-white/10 p-3 rounded-[3rem] shadow-[0_0_100px_-20px_rgba(79,70,229,0.3)] transform lg:rotate-6 hover:rotate-0 transition-all duration-700 group">
              <img 
                src="https://images.unsplash.com/photo-1611974714024-4607ad03d68b?auto=format&fit=crop&q=80&w=800" 
                alt="Nexo Dashboard Preview" 
                className="rounded-[2.5rem] opacity-90 group-hover:opacity-100 transition-opacity"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-10 -left-10 bg-slate-800 border border-white/10 p-5 rounded-3xl shadow-2xl animate-bounce duration-[4000ms]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-shield-check text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Proteção</p>
                    <p className="text-sm font-bold text-white">Nível Bancário</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-10 bg-white text-slate-950 p-6 rounded-[2rem] shadow-2xl animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-arrow-up-right-dots text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crescimento</p>
                    <p className="text-xl font-black text-slate-950">+ 18.4%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-t border-white/5 py-3 px-6 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <div className="flex gap-6">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Sistemas Operacionais
              </span>
              <span className="hidden md:block">Latência: 12ms</span>
            </div>
            <div>© 2024 NEXO FINANCIAL CORP</div>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN SCREENS
  if (currentRoute === AppRoute.APP_LOGIN || currentRoute === AppRoute.ADMIN_LOGIN) {
    const isAdmin = currentRoute === AppRoute.ADMIN_LOGIN;
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isAdmin ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`max-w-md w-full p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 ${isAdmin ? 'bg-slate-900 text-white border border-white/10' : 'bg-white text-slate-900 shadow-indigo-100'}`}>
          <button onClick={() => setCurrentRoute(AppRoute.SWITCHER)} className="mb-8 text-slate-400 hover:text-indigo-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            Home
          </button>
          
          <div className="text-center mb-10">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-2xl ${isAdmin ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
              <i className={`fa-solid ${isAdmin ? 'fa-key' : 'fa-bolt'} text-4xl text-white`}></i>
            </div>
            <h1 className="text-3xl font-black mb-3 tracking-tighter">{isAdmin ? 'Nexo Admin' : 'Acesse sua Conta'}</h1>
            <p className={`text-sm font-medium ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>
              {isAdmin ? 'Área restrita para administradores.' : 'Gerencie seu patrimônio com agilidade.'}
            </p>
          </div>

          <form onSubmit={isAdmin ? handleAdminLogin : handleUserLogin} className="space-y-5">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 text-xs font-bold flex items-center gap-3 border border-rose-500/20">
                <i className="fa-solid fa-circle-exclamation text-base"></i>
                {error}
              </div>
            )}
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isAdmin ? 'text-slate-500' : 'text-slate-400'}`}>Email</label>
              <input 
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isAdmin ? "admin@nexo.com" : "seu@email.com"}
                className={`w-full px-6 py-4 rounded-2xl outline-none focus:ring-2 transition-all font-bold ${isAdmin ? 'bg-slate-800 border-transparent text-white focus:ring-indigo-500' : 'bg-slate-100 border-transparent text-slate-900 focus:ring-indigo-500'}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isAdmin ? 'text-slate-500' : 'text-slate-400'}`}>Senha</label>
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
                className={`w-full px-6 py-4 rounded-2xl outline-none focus:ring-2 transition-all font-bold ${isAdmin ? 'bg-slate-800 border-transparent text-white focus:ring-indigo-500' : 'bg-slate-100 border-transparent text-slate-900 focus:ring-indigo-500'}`}
              />
            </div>
            
            <Button variant="primary" size="lg" className="w-full h-16 mt-4 text-lg font-black rounded-2xl shadow-xl shadow-indigo-500/20" loading={isLoading}>
              Entrar Agora
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARDS
  if (currentRoute === AppRoute.APP_DASHBOARD && currentUser) {
    return <AppDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentRoute === AppRoute.ADMIN_DASHBOARD) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return null;
};

export default App;
