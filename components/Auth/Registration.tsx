
import React, { useState } from 'react';
import { User } from '../../types';
import { storageService } from '../../services/storageService';
import { Button } from '../Shared/Button';

interface RegistrationProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = storageService.getUsers();

    if (mode === 'login') {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        if (!user.active) return setError('Conta desativada pelo administrador.');
        storageService.setSession(user);
        onAuthSuccess(user);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) return setError('As senhas não coincidem.');
      if (users.find(u => u.email === formData.email)) return setError('Este e-mail já está em uso.');

      const newUser: User = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        active: true,
        role: 'user',
        hasPaid: false,
        onboardingComplete: false
      };
      storageService.createUser(newUser);
      storageService.setSession(newUser);
      onAuthSuccess(newUser);
    } else if (mode === 'reset') {
      const user = users.find(u => u.email === formData.email);
      if (!user) return setError('E-mail não encontrado.');
      if (formData.password !== formData.confirmPassword) return setError('As senhas não coincidem.');
      
      storageService.resetPassword(user.id, formData.password);
      alert('Senha redefinida com sucesso!');
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <button onClick={onBack} className="text-slate-400 hover:text-purple-600 font-black text-xs uppercase tracking-widest mb-8 flex items-center gap-2">
          <i className="fa-solid fa-arrow-left"></i> Voltar
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-100">
            <i className="fa-solid fa-bolt text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {mode === 'login' ? 'Bem-vindo de volta' : mode === 'signup' ? 'Crie sua conta' : 'Recuperar Acesso'}
          </h2>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && <div className="p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100">{error}</div>}

          {mode === 'signup' && (
            <input required placeholder="Nome Completo" className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 focus:ring-purple-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          )}
          
          <input required type="email" placeholder="E-mail" className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 focus:ring-purple-600" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          
          {mode === 'signup' && (
            <input placeholder="Telefone" className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 focus:ring-purple-600" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
            <input required type="password" placeholder={mode === 'reset' ? 'Nova Senha' : 'Senha'} className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 focus:ring-purple-600" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          )}

          {(mode === 'signup' || mode === 'reset') && (
            <input required type="password" placeholder="Confirmar Senha" className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 focus:ring-purple-600" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
          )}

          <Button variant="primary" className="w-full h-14 bg-purple-600 hover:bg-purple-700 rounded-2xl font-black text-lg shadow-lg shadow-purple-100">
            {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Cadastrar' : 'Redefinir'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('signup')} className="text-sm font-bold text-slate-500 hover:text-purple-600 block w-full">Não tem conta? <span className="text-purple-600">Criar agora</span></button>
              <button onClick={() => setMode('reset')} className="text-sm font-bold text-slate-400 hover:text-purple-600 block w-full">Esqueci minha senha</button>
            </>
          )}
          {mode !== 'login' && (
            <button onClick={() => setMode('login')} className="text-sm font-bold text-purple-600">Voltar para o Login</button>
          )}
        </div>
      </div>
    </div>
  );
};
