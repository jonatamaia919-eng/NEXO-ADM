
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
    setUsers(data);
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
    if (confirm('Atenção: Esta ação é permanente! Deseja realmente excluir este usuário do sistema?')) {
      storageService.deleteUser(id);
      // Timeout pequeno para garantir a sincronização com o localStorage
      setTimeout(() => fetchUsers(), 100);
    }
  };

  const handleResetPassword = (id: string) => {
    const newPass = prompt('Defina a nova senha para este usuário:');
    if (newPass && newPass.trim() !== '') {
      storageService.resetPassword(id, newPass);
      alert('Senha atualizada com sucesso!');
      fetchUsers();
    } else if (newPass !== null) {
      alert('A senha não pode ser vazia.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-shield-halved text-white text-xl"></i>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 uppercase">Nexo <span className="text-indigo-600">Console</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest hidden md:inline">Ambiente de Controle</span>
          <Button variant="ghost" className="text-rose-600 font-bold hover:bg-rose-50" onClick={onLogout}>
            Sair
          </Button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2 text-slate-900">Gestão de Usuários</h1>
            <p className="text-slate-500 font-medium">Controle acessos, cargos e segurança do ecossistema.</p>
          </div>
          <Button variant="primary" size="lg" className="rounded-2xl shadow-xl shadow-indigo-100" onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-user-plus mr-2"></i>
            Adicionar Membro
          </Button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 font-black text-slate-900 text-xs uppercase tracking-widest">Identificação</th>
                  <th className="px-8 py-5 font-black text-slate-900 text-xs uppercase tracking-widest">Permissão</th>
                  <th className="px-8 py-5 font-black text-slate-900 text-xs uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 font-black text-slate-900 text-xs uppercase tracking-widest text-right">Controles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">Nenhum usuário cadastrado.</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${user.role === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-600'}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-base">{user.name}</p>
                            <p className="text-xs font-bold text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                          {user.role === 'admin' ? 'Administrador' : 'Operador'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {user.active ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            title="Alterar Permissão"
                            onClick={() => handleToggleRole(user)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-user-gear"></i>
                          </button>
                          <button 
                            title={user.active ? "Bloquear Acesso" : "Desbloquear Acesso"}
                            onClick={() => handleToggleStatus(user.id)}
                            className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center transition-all shadow-sm ${user.active ? 'text-amber-600 hover:bg-amber-500 hover:text-white' : 'text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                          >
                            <i className={`fa-solid ${user.active ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                          </button>
                          <button 
                            title="Redefinir Senha"
                            onClick={() => handleResetPassword(user.id)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-key"></i>
                          </button>
                          <button 
                            title="Remover Permanentemente"
                            onClick={() => handleDelete(user.id)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-trash"></i>
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
