
import React, { useState } from 'react';
import { Button } from '../Shared/Button';
import { storageService } from '../../services/storageService';
import { Transaction, BankAccount } from '../../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts: BankAccount[];
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose, onSuccess, accounts }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Alimentação',
    type: 'debit' as 'debit' | 'credit',
    accountId: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountId || !formData.amount || !formData.description) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const numericAmount = parseFloat(formData.amount.replace(',', '.'));
    
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('pt-BR'),
      description: formData.description,
      amount: numericAmount,
      type: formData.type,
      category: formData.category
    };

    storageService.addTransaction(newTx, formData.accountId);
    onSuccess();
    onClose();
    setFormData({ description: '', amount: '', category: 'Alimentação', type: 'debit', accountId: '' });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Novo Lançamento</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gestão de Fluxo de Caixa</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: 'debit'})}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.type === 'debit' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}
            >
              <i className="fa-solid fa-arrow-down mr-2"></i> Gasto
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: 'credit'})}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.type === 'credit' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              <i className="fa-solid fa-arrow-up mr-2"></i> Receita
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Descrição</label>
              <input 
                required
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-custom-primary rounded-2xl font-bold outline-none transition-all"
                placeholder="Ex: Aluguel, Supermercado..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Valor (R$)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-custom-primary rounded-2xl font-bold outline-none transition-all"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Conta Origem</label>
                <select 
                  required
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-custom-primary rounded-2xl font-bold outline-none transition-all appearance-none"
                  value={formData.accountId}
                  onChange={e => setFormData({...formData, accountId: e.target.value})}
                >
                  <option value="">Selecionar Banco</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.bankName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Categoria</label>
              <select 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-custom-primary rounded-2xl font-bold outline-none transition-all appearance-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Alimentação</option>
                <option>Moradia</option>
                <option>Transporte</option>
                <option>Lazer</option>
                <option>Educação</option>
                <option>Saúde</option>
                <option>Investimentos</option>
                <option>Outros</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1 h-16 rounded-2xl font-black">Cancelar</Button>
            <Button variant="primary" type="submit" className="flex-1 h-16 rounded-2xl font-black shadow-xl">Confirmar Lançamento</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
