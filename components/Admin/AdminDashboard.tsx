
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { User } from '../../types';
import { Button } from '../Shared/Button';
import { CreateUserModal } from './CreateUserModal';

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-xl">
            <i className="fa-solid fa-shield-halved text-white text-xl"></i>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none block">NEXO</span>
            <span className="text-[10px] font-black text-purple-600 tracking-widest uppercase">Admin Console</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessão Segura</span>
            <span className="text-xs font-bold text-slate-900">Proprietário Nexo</span>
          </div>
          <Button variant="ghost" className="text-rose-600 font-black hover:bg-rose-50 px-6 py-3 rounded-xl border-transparent" onClick={onLogout}>
            Sair do Console
          </Button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black mb-2 text-slate-900 tracking-tighter">Gestão de Acessos</h1>
            <p className="text-slate-500 font-medium text-lg">Crie e gerencie os usuários autorizados do sistema.</p>
          </div>
          <Button variant="primary" size="lg" className="rounded-2xl shadow-2xl shadow-purple-200 bg-purple-600 px-10 h-16 font-black text-lg" onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-user-plus mr-3"></i>
            Liberar Novo Acesso
          </Button>
        </header>

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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center">
                      <i className="fa-solid fa-users-slash text-5xl text-slate-100 mb-6 block"></i>
                      <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Nenhum acesso cadastrado</p>
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm transition-transform group-hover:scale-110 ${user.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-purple-100 text-purple-700'}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg leading-none mb-1">{user.name}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-purple-50 text-purple-700 border border-purple-100'}`}>
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
                          <button 
                            title="Resetar Chave"
                            onClick={() => handleResetPassword(user.id)}
                            className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-key"></i>
                          </button>
                          <button 
                            title={user.active ? "Suspender Acesso" : "Ativar Acesso"}
                            onClick={() => handleToggleStatus(user.id)}
                            className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center transition-all shadow-sm ${user.active ? 'text-amber-600 hover:bg-amber-500 hover:text-white' : 'text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                          >
                            <i className={`fa-solid ${user.active ? 'fa-user-lock' : 'fa-user-check'}`}></i>
                          </button>
                          <button 
                            title="Remover Permanentemente"
                            onClick={() => handleDelete(user.id)}
                            className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUserCreated={fetchUsers}
      />
    </div>
  );
};
