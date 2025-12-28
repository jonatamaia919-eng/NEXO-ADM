
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Novo Usuário</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Cadastro de Membro</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Nome Completo</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white text-slate-950 font-bold transition-all outline-none placeholder:text-slate-400"
              placeholder="Ex: João Silva"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">E-mail Corporativo</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white text-slate-950 font-bold transition-all outline-none placeholder:text-slate-400"
              placeholder="nome@empresa.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Senha</label>
              <input 
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white text-slate-950 font-bold transition-all outline-none placeholder:text-slate-400"
                placeholder="********"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Cargo</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white text-slate-950 font-bold transition-all outline-none"
              >
                <option value="user">Operador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
            <input 
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={e => setFormData({...formData, active: e.target.checked})}
              className="w-5 h-5 text-indigo-600 border-slate-300 rounded-lg focus:ring-indigo-500 transition-all cursor-pointer"
            />
            <label htmlFor="active" className="text-sm font-black text-indigo-900 cursor-pointer select-none">Habilitar Acesso Imediato</label>
          </div>
          
          <div className="pt-4 flex gap-3">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1 h-14 rounded-2xl font-bold text-slate-500">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="flex-1 h-14 rounded-2xl font-black shadow-lg shadow-indigo-100">
              Criar Conta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
