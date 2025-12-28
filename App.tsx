
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from './types';
import { storageService } from './services/storageService';
import { Registration } from './components/Auth/Registration';
import { Onboarding } from './components/Auth/Onboarding';
import { Payment } from './components/Auth/Payment';
import { AppDashboard } from './components/App/AppDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Button } from './components/Shared/Button';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.SWITCHER);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminAuth, setAdminAuth] = useState(false);

  useEffect(() => {
    const userSession = storageService.getSession();
    const isAdmin = storageService.getAdminSession();

    if (userSession) {
      setCurrentUser(userSession);
      if (!userSession.onboardingComplete) setCurrentRoute(AppRoute.ONBOARDING);
      else if (!userSession.hasPaid) setCurrentRoute(AppRoute.PAYMENT);
      else setCurrentRoute(AppRoute.APP_DASHBOARD);
    } else if (isAdmin) {
      setAdminAuth(true);
      setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
    }
  }, []);

  const handleLogout = () => {
    storageService.clearSession();
    storageService.setAdminSession(false);
    setCurrentUser(null);
    setAdminAuth(false);
    setCurrentRoute(AppRoute.SWITCHER);
  };

  const navigateAfterLogin = (user: User) => {
    setCurrentUser(user);
    if (!user.onboardingComplete) setCurrentRoute(AppRoute.ONBOARDING);
    else if (!user.hasPaid) setCurrentRoute(AppRoute.PAYMENT);
    else setCurrentRoute(AppRoute.APP_DASHBOARD);
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
            <button onClick={() => setCurrentRoute(AppRoute.ADMIN_DASHBOARD)} className="text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-widest mr-4">Admin</button>
            <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 rounded-xl font-bold" onClick={() => setCurrentRoute(AppRoute.REGISTRATION)}>
              Entrar na Conta
            </Button>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-xs font-black mb-8 uppercase">
              <i className="fa-solid fa-star"></i> Seu futuro financeiro começa aqui
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter text-slate-900">
              Assuma o <br />
              <span className="text-purple-600">Controle.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl font-medium leading-relaxed">
              O ecossistema Nexo transforma a complexidade do dinheiro em clareza absoluta. Simples, visual e poderoso.
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 h-16 px-12 text-xl font-black rounded-2xl shadow-xl shadow-purple-200" onClick={() => setCurrentRoute(AppRoute.REGISTRATION)}>
              Começar Agora
            </Button>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-[3rem] shadow-2xl relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" className="rounded-[2.5rem] relative z-10" alt="Interface" />
          </div>
        </main>
      </div>
    );
  }

  if (currentRoute === AppRoute.REGISTRATION) {
    return <Registration onAuthSuccess={navigateAfterLogin} onBack={() => setCurrentRoute(AppRoute.SWITCHER)} />;
  }

  if (currentRoute === AppRoute.ONBOARDING && currentUser) {
    return <Onboarding user={currentUser} onComplete={() => {
      const updated = { ...currentUser, onboardingComplete: true };
      storageService.updateUser(updated);
      storageService.setSession(updated);
      setCurrentUser(updated);
      setCurrentRoute(AppRoute.PAYMENT);
    }} />;
  }

  if (currentRoute === AppRoute.PAYMENT && currentUser) {
    return <Payment user={currentUser} onPaymentSuccess={() => {
      const updated = { ...currentUser, hasPaid: true };
      storageService.updateUser(updated);
      storageService.setSession(updated);
      setCurrentUser(updated);
      setCurrentRoute(AppRoute.APP_DASHBOARD);
    }} />;
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
