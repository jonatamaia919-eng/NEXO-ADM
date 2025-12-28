
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
      <div className="min-h-screen bg-white text-slate-950 font-sans">
        <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <i className="fa-solid fa-bolt text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">NEXO</span>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setCurrentRoute(AppRoute.LOGIN)} 
              className="text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-widest mr-4"
            >
              Acesso Restrito
            </button>
            <Button 
              variant="primary" 
              className="bg-purple-600 hover:bg-purple-700 rounded-xl font-bold" 
              onClick={() => setCurrentRoute(AppRoute.LOGIN)}
            >
              Entrar na Conta
            </Button>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-xs font-black mb-8 uppercase tracking-wider">
              <i className="fa-solid fa-star"></i> Seu futuro financeiro começa aqui
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter text-slate-900">
              Assuma o <br />
              <span className="text-purple-600">Controle.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl font-medium leading-relaxed">
              O ecossistema Nexo transforma a complexidade do dinheiro em clareza absoluta. Simples, visual e poderoso para membros autorizados.
            </p>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 h-16 px-12 text-xl font-black rounded-2xl shadow-xl shadow-purple-200" 
              onClick={() => setCurrentRoute(AppRoute.LOGIN)}
            >
              Começar Agora
            </Button>
          </div>
          
          <div className="bg-white border border-slate-100 p-4 rounded-[3rem] shadow-2xl relative animate-in fade-in zoom-in duration-1000">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
              className="rounded-[2.5rem] relative z-10 w-full shadow-inner" 
              alt="Interface Nexo" 
            />
            {/* Overlay card for aesthetics */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl z-20 border border-slate-50 hidden md:block animate-bounce-slow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-arrow-up"></i>
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Rendimento</span>
              </div>
              <p className="text-2xl font-black text-slate-900">+ R$ 2.450,00</p>
            </div>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">© 2024 NEXO ECOSYSTEM</p>
          <div className="flex gap-8">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Privacidade</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Segurança</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Termos</span>
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
