
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../../types';
import { MOCK_CHART_DATA, MOCK_TRANSACTIONS } from '../../constants';
import { Button } from '../Shared/Button';

interface AppDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AppDashboard: React.FC<AppDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 md:h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-bolt text-white"></i>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">NEXO</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'overview', icon: 'fa-chart-pie', label: 'Início' },
            { id: 'accounts', icon: 'fa-building-columns', label: 'Minhas Contas' },
            { id: 'transactions', icon: 'fa-list-ul', label: 'Histórico' },
            { id: 'cards', icon: 'fa-credit-card', label: 'Cartões' },
            { id: 'invest', icon: 'fa-arrow-trend-up', label: 'Investimentos' },
            { id: 'settings', icon: 'fa-sliders', label: 'Ajustes' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <i className="fa-solid fa-power-off"></i>
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Olá, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-slate-500 font-medium">Sua saúde financeira está <span className="text-emerald-600 font-bold">Excelente (92/100)</span>.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" placeholder="Buscar..." className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 w-full" />
            </div>
            <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 relative">
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-indigo-100 text-sm font-bold mb-1 opacity-80">Saldo Consolidado</p>
                  <h2 className="text-4xl font-black mb-6">R$ 12.450,80</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-transparent">
                      Depositar
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-transparent">
                      Extrato
                    </Button>
                  </div>
                </div>
                <i className="fa-solid fa-wallet absolute -right-4 -bottom-4 text-9xl text-white/10 rotate-12 group-hover:rotate-0 transition-transform"></i>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                    <i className="fa-solid fa-chart-line text-2xl"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-rose-500">↑ 12%</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">vs ontem</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-bold mb-1">Gastos Variáveis</p>
                <h2 className="text-3xl font-black text-slate-900">R$ 2.140,00</h2>
              </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-900 text-xl tracking-tight">Performance Mensal</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold">D</button>
                  <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-100">M</button>
                  <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold">A</button>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} fill="url(#chartGradient)" dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-xl tracking-tight">Atividades</h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Ver Completo</button>
              </div>
              <div className="divide-y divide-slate-50">
                {MOCK_TRANSACTIONS.map(tx => (
                  <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
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
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Confirmado</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Credit Card Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white aspect-[1.6/1] flex flex-col justify-between">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-1.5">
                  <div className="w-8 h-8 bg-white/20 rounded-full blur-md"></div>
                  <div className="w-8 h-8 bg-indigo-500/40 rounded-full blur-md -ml-4"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Platinum Member</span>
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-mono tracking-[0.3em] mb-4">**** **** **** 4242</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase opacity-40 font-bold mb-1">Portador</p>
                    <p className="font-bold text-sm tracking-tight">{user.name.toUpperCase()}</p>
                  </div>
                  <i className="fa-brands fa-cc-mastercard text-4xl opacity-80"></i>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-indigo-600 rounded-full blur-[80px] opacity-30"></div>
            </div>

            {/* Tips & News */}
            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
              <h4 className="font-black text-indigo-900 text-lg mb-6">Nexo Academy 🎓</h4>
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-colors group">
                  <p className="text-xs font-black text-indigo-500 uppercase mb-2">Dica de Hoje</p>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors leading-relaxed">Como diversificar sua carteira em tempos de inflação alta.</p>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-colors group">
                  <p className="text-xs font-black text-emerald-500 uppercase mb-2">Novidade</p>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors leading-relaxed">O Pix Automático agora está disponível na Nexo!</p>
                </div>
              </div>
              <Button variant="primary" className="w-full mt-8 rounded-2xl h-12 shadow-indigo-200 shadow-xl">
                Acessar Portal
              </Button>
            </div>

            {/* Savings Goals */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-900 text-lg mb-6 tracking-tight">Metas de Economia</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-600">iPhone 16 Pro</span>
                    <span className="text-sm font-black text-slate-900">45%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full w-[45%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-600">Férias na Grécia</span>
                    <span className="text-sm font-black text-slate-900">12%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[12%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
