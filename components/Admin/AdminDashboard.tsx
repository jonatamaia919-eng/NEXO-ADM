
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
    setUsers([...data]); // Força nova referência para o React detectar mudança
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = (id: string) => {
    storageService.toggleUserStatus(id);
    fetchUsers();
  };

  const handleToggleRole = (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    storageService.updateUser({ ...user, role: newRole });
    fetchUsers();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Atenção: Esta ação é irreversível! O usuário será removido permanentemente. Prosseguir?')) {
      storageService.deleteUser(id);
      fetchUsers();
    }
  };

  const handleResetPassword = (id: string) => {
    const newPass = window.prompt('Digite a nova senha de acesso:');
    if (newPass !== null) {
      if (newPass.trim().length >= 4) {
        storageService.resetPassword(id, newPass.trim());
        alert('Chave de acesso redefinida com sucesso.');
        fetchUsers();
      } else {
        alert('A senha deve ter pelo menos 4 caracteres.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-shield-halved text-white text-xl"></i>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 uppercase">Nexo <span className="text-indigo-600">Console</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessão Ativa</span>
            <span className="text-xs font-bold text-slate-700">Administrador Master</span>
          </div>
          <Button variant="ghost" className="text-rose-600 font-bold hover:bg-rose-50 px-4 py-2 rounded-xl" onClick={onLogout}>
            Sair
          </Button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2 text-slate-900 tracking-tight">Gestão de Usuários</h1>
            <p className="text-slate-500 font-medium">Configure acessos e permissões dos usuários do ecossistema.</p>
          </div>
          <Button variant="primary" size="lg" className="rounded-2xl shadow-xl shadow-indigo-100 px-8 h-14 font-black" onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-plus mr-2"></i>
            Novo Usuário
          </Button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Identificação</th>
                  <th className="px-8 py-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Permissão</th>
                  <th className="px-8 py-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic">Nenhum registro encontrado no sistema.</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 ${user.role === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-600'}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-base">{user.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                          {user.role === 'admin' ? 'Master' : 'Membro'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${user.active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.active ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {user.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button 
                            title="Alterar Permissão"
                            onClick={() => handleToggleRole(user)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-user-shield text-xs"></i>
                          </button>
                          <button 
                            title={user.active ? "Bloquear" : "Desbloquear"}
                            onClick={() => handleToggleStatus(user.id)}
                            className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center transition-all shadow-sm ${user.active ? 'text-amber-600 hover:bg-amber-500 hover:text-white' : 'text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                          >
                            <i className={`fa-solid ${user.active ? 'fa-lock' : 'fa-unlock'} text-xs`}></i>
                          </button>
                          <button 
                            title="Resetar Senha"
                            onClick={() => handleResetPassword(user.id)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-key text-xs"></i>
                          </button>
                          <button 
                            title="Excluir Permanentemente"
                            onClick={() => handleDelete(user.id)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-trash-can text-xs"></i>
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
