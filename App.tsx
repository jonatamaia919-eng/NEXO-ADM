
import React, { useState, useEffect, useCallback } from 'react';
import { AppRoute, User, AppTheme } from './types';
import { storageService } from './services/storageService';
import { Login } from './components/Auth/Login';
import { AppDashboard } from './components/App/AppDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Button } from './components/Shared/Button';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.SWITCHER);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [theme, setTheme] = useState<AppTheme>(storageService.getTheme());

  const applyTheme = useCallback((newTheme: AppTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', newTheme.primary);
    root.style.setProperty('--secondary', newTheme.secondary);
    
    // Calcula brilho/transparência simples para o glow
    const glow = `${newTheme.primary}4d`; // Adiciona 30% alpha (4d em hex)
    const lightBg = `${newTheme.primary}1a`; // Adiciona 10% alpha (1a em hex)
    root.style.setProperty('--primary-glow', glow);
    root.style.setProperty('--primary-bg', lightBg);
    
    storageService.setTheme(newTheme);
    setTheme(newTheme);
  }, []);

  useEffect(() => {
    applyTheme(storageService.getTheme());
    const userSession = storageService.getSession();
    const isAdmin = storageService.getAdminSession();

    if (userSession) {
      setCurrentUser(userSession);
      setCurrentRoute(AppRoute.APP_DASHBOARD);
    } else if (isAdmin) {
      setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
    }
    setIsInitializing(false);
  }, [applyTheme]);

  const handleLogout = () => {
    storageService.clearSession();
    storageService.setAdminSession(false);
    setCurrentUser(null);
    setCurrentRoute(AppRoute.SWITCHER);
  };

  const handleLoginSuccess = (user: User) => {
    storageService.clearSession();
    storageService.setAdminSession(false);

    if (user.role === 'admin') {
      storageService.setAdminSession(true);
      setCurrentUser(null);
      setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
    } else {
      storageService.setSession(user);
      setCurrentUser(user);
      setCurrentRoute(AppRoute.APP_DASHBOARD);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentRoute === AppRoute.SWITCHER) {
    return (
      <div className="min-h-screen bg-white text-slate-950 font-sans overflow-x-hidden">
        <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-100 relative z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-custom-primary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-bolt text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">NEXO</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="hidden md:inline-block text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Acesso Restrito</span>
            <Button 
              variant="primary" 
              className="rounded-xl font-bold h-12 px-8" 
              onClick={() => setCurrentRoute(AppRoute.LOGIN)}
            >
              Entrar na Conta
            </Button>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-bg)] rounded-full text-custom-primary text-[10px] font-black mb-8 uppercase tracking-[0.2em]">
              <i className="fa-solid fa-star"></i> Inteligência Financeira Exclusiva
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] mb-8 tracking-tighter text-slate-900">
              Assuma o <br />
              <span className="text-custom-primary">Controle.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl font-medium leading-relaxed">
              O ecossistema Nexo transforma a complexidade do dinheiro em clareza absoluta. Design minimalista e poderoso para membros selecionados.
            </p>
            <Button 
              size="lg" 
              className="h-20 px-12 text-2xl font-black rounded-[2rem] shadow-2xl shadow-indigo-100 group transition-all" 
              onClick={() => setCurrentRoute(AppRoute.LOGIN)}
            >
              Acessar Painel <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
            </Button>
          </div>
          
          <div className="relative animate-in fade-in zoom-in duration-1000">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--primary-bg)] rounded-full blur-[100px] opacity-40"></div>
            <div className="bg-white border border-slate-100 p-4 rounded-[4rem] shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                className="rounded-[3.5rem] w-full shadow-inner grayscale-[10%] hover:grayscale-0 transition-all duration-700" 
                alt="Dashboard Nexo" 
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2.5rem] shadow-2xl z-20 border border-slate-50 hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rendimento Mensal</span>
                    <p className="text-2xl font-black text-slate-900">+ R$ 4.250,80</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[70%] h-full bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {currentRoute === AppRoute.LOGIN && (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onBack={() => setCurrentRoute(AppRoute.SWITCHER)}
        />
      )}

      {currentRoute === AppRoute.APP_DASHBOARD && currentUser && (
        <AppDashboard user={currentUser} onLogout={handleLogout} />
      )}

      {currentRoute === AppRoute.ADMIN_DASHBOARD && (
        <AdminDashboard onLogout={handleLogout} onThemeChange={applyTheme} currentTheme={theme} />
      )}
    </div>
  );
};

export default App;
