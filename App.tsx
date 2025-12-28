
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

  // LANDING PAGE COMPONENT
  if (currentRoute === AppRoute.SWITCHER) {
    return (
      <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-bolt text-white"></i>
            </div>
            <span className="text-xl font-black tracking-tighter">NEXO</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Produtos</a>
            <a href="#" className="hover:text-white transition-colors">Segurança</a>
            <a href="#" className="hover:text-white transition-colors">Empresa</a>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentRoute(AppRoute.ADMIN_LOGIN)}
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2"
            >
              Admin
            </button>
            <Button variant="primary" size="sm" onClick={() => setCurrentRoute(AppRoute.APP_LOGIN)}>
              Acessar Conta
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center md:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold mb-6 tracking-wider uppercase">
              O Futuro das Finanças Chegou
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Gerencie seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">patrimônio</span> com inteligência.
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-xl">
              Nexo é o ecossistema financeiro completo para quem busca controle total, segurança de nível bancário e uma experiência de usuário sem precedentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" className="h-14 px-8 text-lg" onClick={() => setCurrentRoute(AppRoute.APP_LOGIN)}>
                Começar Agora
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </Button>
              <Button variant="ghost" size="lg" className="h-14 px-8 text-lg border border-white/10 hover:bg-white/5">
                Saiba Mais
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-6 grayscale opacity-50">
              <i className="fa-brands fa-apple text-3xl"></i>
              <i className="fa-brands fa-google-pay text-4xl"></i>
              <i className="fa-brands fa-visa text-4xl"></i>
              <i className="fa-brands fa-mastercard text-4xl"></i>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-600/10 rounded-full blur-[100px]"></div>
            
            <div className="relative bg-slate-900 border border-white/10 p-2 rounded-[2.5rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" 
                alt="Dashboard Preview" 
                className="rounded-[2.2rem] shadow-inner"
              />
              <div className="absolute -bottom-6 -right-6 bg-white text-slate-950 p-6 rounded-3xl shadow-2xl animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Recebido</p>
                    <p className="text-lg font-black">+ R$ 4.500,00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2024 Nexo Financial Ecosystem. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </footer>
      </div>
    );
  }

  // LOGIN SCREENS
  if (currentRoute === AppRoute.APP_LOGIN || currentRoute === AppRoute.ADMIN_LOGIN) {
    const isAdmin = currentRoute === AppRoute.ADMIN_LOGIN;
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isAdmin ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${isAdmin ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
          <button onClick={() => setCurrentRoute(AppRoute.SWITCHER)} className="mb-6 text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            Voltar para o site
          </button>
          
          <div className="text-center mb-10">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isAdmin ? 'bg-indigo-600 shadow-xl shadow-indigo-500/20' : 'bg-indigo-600 shadow-xl shadow-indigo-500/20'}`}>
              <i className={`fa-solid ${isAdmin ? 'fa-user-shield' : 'fa-fingerprint'} text-3xl text-white`}></i>
            </div>
            <h1 className="text-2xl font-black mb-2">{isAdmin ? 'Nexo Control' : 'Acesse o Nexo App'}</h1>
            <p className={`text-sm ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>
              {isAdmin ? 'Identifique-se para acessar o painel de mestre.' : 'Insira suas credenciais para gerenciar sua carteira.'}
            </p>
          </div>

          <form onSubmit={isAdmin ? handleAdminLogin : handleUserLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2 border border-rose-100 animate-bounce">
                <i className="fa-solid fa-circle-exclamation text-sm"></i>
                {error}
              </div>
            )}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>Email Corporativo</label>
              <input 
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isAdmin ? 'admin@nexo.com' : 'usuario@exemplo.com'}
                className={`w-full px-5 py-3.5 rounded-2xl outline-none focus:ring-2 transition-all ${isAdmin ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-500' : 'bg-slate-100 border-transparent text-slate-900 focus:ring-indigo-500'}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>Chave de Acesso</label>
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
                className={`w-full px-5 py-3.5 rounded-2xl outline-none focus:ring-2 transition-all ${isAdmin ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-500' : 'bg-slate-100 border-transparent text-slate-900 focus:ring-indigo-500'}`}
              />
            </div>
            
            <Button variant="primary" size="lg" className="w-full h-14 mt-6 text-lg rounded-2xl" loading={isLoading}>
              Autenticar
            </Button>
          </form>

          {isAdmin && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-center text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                Criptografia RSA 4096-bit Ativa
              </p>
            </div>
          )}
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
