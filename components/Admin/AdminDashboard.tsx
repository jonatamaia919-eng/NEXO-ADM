
import React, { useState, useEffect, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { User, AppTheme } from '../../types';
import { Button } from '../Shared/Button';
import { CreateUserModal } from './CreateUserModal';

interface AdminDashboardProps {
  onLogout: () => void;
  onThemeChange: (theme: AppTheme) => void;
  currentTheme: AppTheme;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onThemeChange, currentTheme }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  const [theme, setTheme] = useState<AppTheme>(currentTheme);

  // Estados de busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  const fetchUsers = () => {
    const data = storageService.getUsers();
    setUsers([...data]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = (id: string) => {
    storageService.toggleUserStatus(id);
    fetchUsers();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este acesso permanentemente?')) {
      storageService.deleteUser(id);
      fetchUsers();
    }
  };

  const handleResetPassword = (id: string) => {
    const newPass = window.prompt('Nova senha para este usuário:');
    if (newPass && newPass.trim().length >= 4) {
      storageService.resetPassword(id, newPass.trim());
      alert('Senha atualizada.');
      fetchUsers();
    }
  };

  const handleThemeUpdate = (key: keyof AppTheme, color: string) => {
    const newTheme = { ...theme, [key]: color };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  // Lógica de filtragem computada
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? user.active : !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-xl">
            <i className="fa-solid fa-shield-halved text-white text-xl"></i>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none block">NEXO</span>
            <span className="text-[10px] font-black text-custom-primary tracking-widest uppercase">Admin Console</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl mr-4">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Usuários
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Configurações
            </button>
          </nav>
          <Button variant="ghost" className="text-rose-600 font-black hover:bg-rose-50 px-6 py-3 rounded-xl" onClick={onLogout}>
            Sair
          </Button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {activeTab === 'users' ? (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h1 className="text-5xl font-black mb-2 text-slate-900 tracking-tighter">Gestão de Acessos</h1>
                <p className="text-slate-500 font-medium text-lg">Crie e gerencie os usuários autorizados do sistema.</p>
              </div>
              <Button variant="primary" size="lg" className="rounded-2xl shadow-2xl shadow-indigo-100 bg-custom-primary px-10 h-16 font-black text-lg" onClick={() => setIsModalOpen(true)}>
                <i className="fa-solid fa-user-plus mr-3"></i>
                Liberar Novo Acesso
              </Button>
            </header>

            {/* Barra de Busca e Filtros */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-custom-primary transition-colors"></i>
                <input 
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  className="w-full pl-14 pr-8 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 transition-all focus:border-custom-primary shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select 
                  className="px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-600 focus:border-custom-primary shadow-sm cursor-pointer"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                >
                  <option value="all">Todos Cargos</option>
                  <option value="admin">Administradores</option>
                  <option value="user">Operadores</option>
                </select>
                <select 
                  className="px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-600 focus:border-custom-primary shadow-sm cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">Todos Status</option>
                  <option value="active">Liberados</option>
                  <option value="blocked">Bloqueados</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.25em]">Membro Autorizado</th>
                      <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.25em]">Permissão</th>
                      <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.25em]">Status</th>
                      <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.25em] text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${user.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-[var(--primary-bg)] text-custom-primary'}`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg leading-none mb-1">{user.name}</p>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                            {user.role === 'admin' ? 'Master' : 'Membro'}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full ${user.active ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.active ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {user.active ? 'Liberado' : 'Bloqueado'}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleResetPassword(user.id)} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                              <i className="fa-solid fa-key"></i>
                            </button>
                            <button onClick={() => handleToggleStatus(user.id)} className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center transition-all ${user.active ? 'text-amber-600 hover:bg-amber-500 hover:text-white' : 'text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}>
                              <i className={`fa-solid ${user.active ? 'fa-user-lock' : 'fa-user-check'}`}></i>
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-10 py-20 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 text-3xl">
                              <i className="fa-solid fa-user-slash"></i>
                            </div>
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum usuário encontrado com esses filtros</p>
                            <button 
                              onClick={() => { setSearchTerm(''); setRoleFilter('all'); setStatusFilter('all'); }}
                              className="text-custom-primary font-black text-xs uppercase tracking-widest hover:underline"
                            >
                              Limpar Filtros
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12">
              <h1 className="text-5xl font-black mb-2 text-slate-900 tracking-tighter">Personalização</h1>
              <p className="text-slate-500 font-medium text-lg">Defina a identidade visual do seu ecossistema.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Cores do Sistema</h3>
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-900 mb-1">Cor Primária</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Botões, Destaques e Ativos</p>
                    </div>
                    <input 
                      type="color" 
                      value={theme.primary}
                      onChange={(e) => handleThemeUpdate('primary', e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none outline-none" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-900 mb-1">Cor Secundária</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cards de destaque e Gradientes</p>
                    </div>
                    <input 
                      type="color" 
                      value={theme.secondary}
                      onChange={(e) => handleThemeUpdate('secondary', e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none outline-none" 
                    />
                  </div>
                </div>

                <div className="mt-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-700 leading-relaxed">
                    <i className="fa-solid fa-circle-info mr-2"></i>
                    As mudanças são aplicadas em tempo real e afetarão todos os usuários do sistema imediatamente.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <h3 className="text-2xl font-black text-white mb-8 tracking-tight relative z-10">Visualização</h3>
                <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center text-white" style={{ backgroundColor: theme.primary }}>
                       <i className="fa-solid fa-bolt text-xs"></i>
                    </div>
                    <p className="text-white font-black text-lg mb-2">Exemplo de Card</p>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full" style={{ backgroundColor: theme.primary, width: '60%' }}></div>
                    </div>
                  </div>
                  <button className="w-full py-4 rounded-xl font-black text-white text-sm uppercase tracking-widest transition-all hover:scale-[1.02]" style={{ backgroundColor: theme.primary }}>
                    Botão Primário
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: theme.primary }}></div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUserCreated={fetchUsers} />
    </div>
  );
};
