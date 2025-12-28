
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { User } from '../../types';
import { Button } from '../Shared/Button';
import { CreateUserModal } from './CreateUserModal';

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = () => {
    setUsers(storageService.getUsers());
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
    if (confirm('Deseja realmente excluir este usuário?')) {
      storageService.deleteUser(id);
      fetchUsers();
    }
  };

  const handleResetPassword = (id: string) => {
    const newPass = prompt('Digite a nova senha:');
    if (newPass) {
      storageService.resetPassword(id, newPass);
      alert('Senha alterada com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-shield-halved text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">NEXO <span className="text-indigo-500">ADMIN</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 hidden md:inline">Painel de <span className="text-white font-medium">Controle Total</span></span>
          <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={onLogout}>
            Sair
          </Button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Usuários & Permissões</h1>
            <p className="text-slate-400">Configure quem pode acessar os módulos do ecossistema.</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-plus mr-2"></i>
            Novo Usuário
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-users text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-slate-400">Total</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-user-shield text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-slate-400">Administradores</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-user-check text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-slate-400">Ativos</p>
                <p className="text-2xl font-bold">{users.filter(u => u.active).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Usuário</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Cargo</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {user.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          title="Alternar Cargo"
                          onClick={() => handleToggleRole(user)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <i className="fa-solid fa-user-gear"></i>
                        </button>
                        <button 
                          title="Bloquear/Desbloquear"
                          onClick={() => handleToggleStatus(user.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${user.active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        >
                          <i className={`fa-solid ${user.active ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                        </button>
                        <button 
                          title="Resetar Senha"
                          onClick={() => handleResetPassword(user.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <i className="fa-solid fa-key"></i>
                        </button>
                        <button 
                          title="Excluir"
                          onClick={() => handleDelete(user.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
