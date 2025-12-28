
import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 md:h-screen z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-100">
            <i className="fa-solid fa-bolt text-white"></i>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">NEXO</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {[
            { id: 'overview', icon: 'fa-chart-pie', label: 'Dashboard' },
            { id: 'accounts', icon: 'fa-building-columns', label: 'Meus Bancos' },
            { id: 'transactions', icon: 'fa-list-ul', label: 'Histórico' },
            { id: 'settings', icon: 'fa-sliders', label: 'Ajustes' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-100' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-purple-600'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-50 p-4 rounded-3xl flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-black">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black">Plano Premium</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-50 transition-colors">
            <i className="fa-solid fa-power-off"></i> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Olá, {user.name.split(' ')[0]}!</h1>
              <p className="text-slate-500 font-medium">Sua jornada financeira está em <span className="text-purple-600 font-bold">evolução</span>.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-purple-600 p-8 rounded-[2.5rem] shadow-2xl shadow-purple-200 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-purple-200 text-sm font-bold mb-2">Saldo Total Consolidado</p>
                  <h2 className="text-5xl font-black mb-10 tracking-tight">R$ 12.450,80</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="bg-white/10 text-white rounded-xl h-12 px-6 font-black border-transparent hover:bg-white/20">Depositar</Button>
                    <Button variant="ghost" className="bg-white/10 text-white rounded-xl h-12 px-6 font-black border-transparent hover:bg-white/20">Analítico</Button>
                  </div>
                </div>
                <i className="fa-solid fa-wallet absolute -right-4 -bottom-4 text-9xl text-white/10 rotate-12"></i>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-bold mb-1">Gastos no Mês</p>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">R$ 2.140,00</h2>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-rose-500 font-black text-xs">↑ 12.4%</span>
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Comparado ao mês anterior</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-900 text-xl mb-8">Performance Financeira</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA}>
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={4} fill="url(#purpleGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && <AccountsView />}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-xl">Últimas Atividades</h3>
              <Button variant="ghost" className="text-purple-600 font-black">Exportar PDF</Button>
            </div>
            <div className="divide-y divide-slate-50">
              {MOCK_TRANSACTIONS.map(tx => (
                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      <i className={`fa-solid ${tx.type === 'credit' ? 'fa-arrow-down-left' : 'fa-bag-shopping'}`}></i>
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{tx.description}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'credit' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
