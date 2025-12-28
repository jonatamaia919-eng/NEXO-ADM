
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
          <span className="text-xl font-bold text-slate-900 tracking-tight">NEXO APP</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'overview', icon: 'fa-chart-pie', label: 'Visão Geral' },
            { id: 'accounts', icon: 'fa-building-columns', label: 'Contas' },
            { id: 'transactions', icon: 'fa-list-ul', label: 'Transações' },
            { id: 'cards', icon: 'fa-credit-card', label: 'Meus Cartões' },
            { id: 'settings', icon: 'fa-sliders', label: 'Configurações' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-rose-600" onClick={onLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bem-vindo ao NEXO, {user.name.split(' ')[0]}!</h1>
            <p className="text-slate-500">Aqui está o resumo da sua vida financeira hoje.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="secondary" className="flex-1 md:flex-none">
              <i className="fa-solid fa-download mr-2"></i>
              Relatório
            </Button>
            <Button variant="primary" className="flex-1 md:flex-none">
              <i className="fa-solid fa-plus mr-2"></i>
              Nova Transferência
            </Button>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <i className="fa-solid fa-wallet text-xl"></i>
              </div>
              <span className="text-xs font-bold text-emerald-600">+12% vs mês ant.</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Saldo Disponível</p>
            <h2 className="text-3xl font-bold text-slate-900">R$ 12.450,80</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <i className="fa-solid fa-arrow-trend-down text-xl"></i>
              </div>
              <span className="text-xs font-bold text-rose-600">-2.4% vs mês ant.</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Gastos (Mês)</p>
            <h2 className="text-3xl font-bold text-slate-900">R$ 3.840,15</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <i className="fa-solid fa-piggy-bank text-xl"></i>
              </div>
              <span className="text-xs font-bold text-indigo-600">+R$ 450,00</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Economias</p>
            <h2 className="text-3xl font-bold text-slate-900">R$ 45.200,00</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Fluxo de Caixa</h3>
                <select className="bg-slate-50 border-none text-xs font-bold px-3 py-1.5 rounded-lg outline-none">
                  <option>Últimos 6 meses</option>
                  <option>Últimos 12 meses</option>
                </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Transações Recentes</h3>
                <button className="text-xs font-bold text-indigo-600 hover:underline">Ver todas</button>
              </div>
              <div className="divide-y divide-slate-50">
                {MOCK_TRANSACTIONS.map(tx => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        <i className={`fa-solid ${tx.type === 'credit' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{tx.description}</p>
                        <p className="text-xs text-slate-500">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'credit' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Content */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-widest">Nexo Platinum</p>
                <div className="flex justify-between items-center mb-8">
                  <i className="fa-solid fa-microchip text-3xl text-amber-400"></i>
                  <i className="fa-brands fa-cc-mastercard text-3xl opacity-80"></i>
                </div>
                <h4 className="text-xl font-mono mb-6">**** **** **** 8824</h4>
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">Portador</p>
                    <p className="text-sm font-semibold">{user.name.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase">Validade</p>
                    <p className="text-sm font-semibold">12/28</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Metas de Economia</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-600">Viagem Europa</span>
                    <span className="text-slate-900 font-bold">75%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-600">Fundo de Emergência</span>
                    <span className="text-slate-900 font-bold">40%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-600">Novo Carro</span>
                    <span className="text-slate-900 font-bold">12%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-6 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                Ver Todas as Metas
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
