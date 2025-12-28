
import React, { useState } from 'react';
import { Button } from '../Shared/Button';
import { User } from '../../types';
import { storageService } from '../../services/storageService';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    active: true,
    role: 'user' as 'admin' | 'user'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: crypto.randomUUID(),
      ...formData
    };
    storageService.createUser(newUser);
    onUserCreated();
    onClose();
    setFormData({ name: '', email: '', password: '', active: true, role: 'user' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Novo Usuário</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="Ex: João Silva"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="joao@nexo.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
              <input 
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="********"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cargo</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
              >
                <option value="user">Usuário Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={e => setFormData({...formData, active: e.target.checked})}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-slate-700">Usuário Ativo</label>
          </div>
          
          <div className="pt-4 flex gap-3">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button variant="primary" type="submit" className="flex-1">Criar Usuário</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
