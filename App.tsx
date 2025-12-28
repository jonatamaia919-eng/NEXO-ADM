
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from './types';
import { storageService } from './services/storageService';
import { Login } from './components/Auth/Login';
import { AppDashboard } from './components/App/AppDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Button } from './components/Shared/Button';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.SWITCHER);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  const handleLogout = () => {
    storageService.clearSession();
    storageService.setAdminSession(false);
    setCurrentUser(null);
    setCurrentRoute(AppRoute.SWITCHER);
  };

  const handleLoginSuccess = (user: User) => {
    if (user.role === 'admin') {
      storageService.setAdminSession(true);
      setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
    } else {
      setCurrentUser(user);
      storageService.setSession(user);
      setCurrentRoute(AppRoute.APP_DASHBOARD);
    }
  };

  if (currentRoute === AppRoute.SWITCHER) {
    return (
      <div className="min-h-screen bg-white text-slate-950 font-sans overflow-x-hidden">
        {/* Navbar */}
        <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-100 relative z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <i className="fa-solid fa-bolt text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">NEXO</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="hidden md:inline-block text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Acesso Restrito</span>
            <Button 
              variant="primary" 
              className="bg-purple-600 hover:bg-purple-700 rounded-xl font-bold h-12 px-8" 
              onClick={() => setCurrentRoute(AppRoute.LOGIN)}
            >
              Entrar na Conta
            </Button>
          </div>
        </nav>
        
        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-[10px] font-black mb-8 uppercase tracking-[0.2em]">
              <i className="fa-solid fa-star"></i> Inteligência Financeira Exclusiva
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] mb-8 tracking-tighter text-slate-900">
              Assuma o <br />
              <span className="text-purple-600">Controle.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl font-medium leading-relaxed">
              O ecossistema Nexo transforma a complexidade do dinheiro em clareza absoluta. Design minimalista e poderoso para membros selecionados.
            </p>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 h-20 px-12 text-2xl font-black rounded-[2rem] shadow-2xl shadow-purple-200 group transition-all" 
              onClick={() => setCurrentRoute(AppRoute.LOGIN)}
            >
              Acessar Painel <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
            </Button>
          </div>
          
          <div className="relative animate-in fade-in zoom-in duration-1000">
            {/* Decorative Blurs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-200 rounded-full blur-[100px] opacity-40"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100 rounded-full blur-[80px] opacity-40"></div>
            
            <div className="bg-white border border-slate-100 p-4 rounded-[4rem] shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                className="rounded-[3.5rem] w-full shadow-inner grayscale-[10%] hover:grayscale-0 transition-all duration-700" 
                alt="Dashboard Nexo" 
              />
              
              {/* Floating Aesthetic Cards */}
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

              <div className="absolute -top-12 -left-12 bg-purple-600 p-6 rounded-[2rem] shadow-2xl z-20 hidden md:block animate-pulse">
                <i className="fa-solid fa-shield-halved text-white text-3xl"></i>
              </div>
            </div>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-bolt text-white text-sm"></i>
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900">NEXO</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Excellence in Personal Finance</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            <div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Plataforma</p>
              <ul className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <li className="hover:text-purple-600 cursor-pointer transition-colors">Acesso</li>
                <li className="hover:text-purple-600 cursor-pointer transition-colors">Segurança</li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Legal</p>
              <ul className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <li className="hover:text-purple-600 cursor-pointer transition-colors">Termos</li>
                <li className="hover:text-purple-600 cursor-pointer transition-colors">Privacidade</li>
              </ul>
            </div>
          </div>
        </footer>
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
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
