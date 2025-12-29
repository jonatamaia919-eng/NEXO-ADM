
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../../types';
import { MOCK_CHART_DATA, MOCK_TRANSACTIONS } from '../../constants';
import { Button } from '../Shared/Button';
import { AccountsView } from './AccountsView';

interface AppDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AppDashboard: React.FC<AppDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 md:h-screen z-20">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-custom-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-100">
            <i className="fa-solid fa-bolt text-white text-xl"></i>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter block leading-none">NEXO</span>
            <span className="text-[10px] font-black text-custom-primary uppercase tracking-widest">Premium Access</span>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4">
          {[
            { id: 'overview', icon: 'fa-chart-pie', label: 'Dashboard' },
            { id: 'accounts', icon: 'fa-building-columns', label: 'Meus Bancos' },
            { id: 'transactions', icon: 'fa-list-ul', label: 'Histórico' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-black transition-all ${
                activeTab === item.id 
                  ? 'bg-custom-primary text-white shadow-2xl shadow-indigo-100 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-custom-primary'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 p-5 rounded-[2rem] flex items-center gap-4 mb-4 border border-slate-100">
            <div className="w-12 h-12 bg-[var(--primary-bg)] text-custom-primary rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">{user.name || 'Usuário'}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black">Membro Autorizado</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-50 transition-colors">
            <i className="fa-solid fa-power-off"></i> Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Olá, {user.name?.split(' ')[0] || 'Membro'}!</h1>
                <p className="text-slate-500 font-medium text-lg">Seu resumo financeiro atualizado.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" className="h-14 px-8 rounded-2xl font-black shadow-lg shadow-indigo-100">
                  <i className="fa-solid fa-plus mr-2"></i> Novo Gasto
                </Button>
              </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-custom-primary p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-white/80 text-sm font-bold mb-3 uppercase tracking-widest">Saldo Total Consolidado</p>
                  <h2 className="text-6xl font-black mb-12 tracking-tight">R$ 12.450,80</h2>
                  <div className="flex gap-4">
                    <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2">
                      <i className="fa-solid fa-eye"></i> Detalhes
                    </button>
                    <button className="bg-white text-custom-primary px-8 py-4 rounded-2xl font-black transition-all shadow-xl">
                      Gerenciar
                    </button>
                  </div>
                </div>
                <i className="fa-solid fa-wallet absolute -right-6 -bottom-6 text-[12rem] text-white/10 rotate-12"></i>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                    <i className="fa-solid fa-arrow-trend-down text-xl"></i>
                  </div>
                  <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-widest">Saídas Mensais</p>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">R$ 2.140,00</h2>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-rose-500 font-black text-xs px-3 py-1 bg-rose-50 rounded-full">↑ 12.4%</span>
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">vs mês anterior</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[400px]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-black text-slate-900 text-2xl tracking-tight">Fluxo de Caixa</h3>
              </div>
              <div className="h-80 w-full">
                {isLoaded ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_CHART_DATA}>
                      <defs>
                        <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 800, fill: '#94a3b8'}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 800, fill: '#94a3b8'}} dx={-15} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '15px' }} 
                        itemStyle={{ fontWeight: 900, color: 'var(--primary)' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={6} fill="url(#primaryGrad)" isAnimationActive={true} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-slate-300 font-black">
                    Carregando Gráficos...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'accounts' && <AccountsView />}
      </main>
    </div>
  );
};
