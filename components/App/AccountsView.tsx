
import React, { useState, useEffect } from 'react';
import { Button } from '../Shared/Button';
import { BankAccount } from '../../types';
import { storageService } from '../../services/storageService';

export const AccountsView: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAcc, setNewAcc] = useState({ bankName: '', balance: '' });

  useEffect(() => {
    const data = localStorage.getItem('nexo_accounts');
    if (data) setAccounts(JSON.parse(data));
  }, []);

  const saveAccounts = (data: BankAccount[]) => {
    setAccounts(data);
    localStorage.setItem('nexo_accounts', JSON.stringify(data));
  };

  const handleAdd = () => {
    // Normalização numérica brasileira (R$ 80,00)
    let amount = newAcc.balance.replace(/\./g, '').replace(',', '.');
    const numericValue = parseFloat(amount) || 0;

    const acc: BankAccount = {
      id: crypto.randomUUID(),
      bankName: newAcc.bankName,
      balance: numericValue,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    saveAccounts([...accounts, acc]);
    setIsModalOpen(false);
    setNewAcc({ bankName: '', balance: '' });
  };

  const handleDelete = (id: string) => {
    saveAccounts(accounts.filter(a => a.id !== id));
  };

  const total = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Meus Bancos</h2>
          <p className="text-slate-500 font-medium">Patrimônio total: <span className="text-purple-600 font-black">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
        </div>
        <Button variant="primary" className="bg-purple-600 rounded-2xl h-12 px-6 font-black" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-plus mr-2"></i> Adicionar Banco
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(acc.id)} className="text-rose-400 hover:text-rose-600"><i className="fa-solid fa-trash"></i></button>
            </div>
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white font-black" style={{ backgroundColor: acc.color }}>
              {acc.bankName.charAt(0)}
            </div>
            <h3 className="font-black text-slate-900 text-lg">{acc.bankName}</h3>
            <p className="text-2xl font-black text-purple-600 mt-2">R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
            <i className="fa-solid fa-building-columns text-4xl text-slate-200 mb-4"></i>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhuma conta vinculada</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Nova Conta</h3>
            <div className="space-y-4">
              <input placeholder="Nome do Banco (Ex: Nubank)" className="w-full px-6 py-4 bg-slate-100 rounded-2xl font-bold outline-none" value={newAcc.bankName} onChange={e => setNewAcc({...newAcc, bankName: e.target.value})} />
              <input placeholder="Saldo Atual (Ex: 80,00)" className="w-full px-6 py-4 bg-slate-100 rounded-2xl font-bold outline-none" value={newAcc.balance} onChange={e => setNewAcc({...newAcc, balance: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1 rounded-xl h-14" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" className="flex-1 bg-purple-600 rounded-xl h-14" onClick={handleAdd}>Salvar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
