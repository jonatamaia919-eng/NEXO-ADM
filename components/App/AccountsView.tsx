
import React, { useState, useEffect } from 'react';
import { Button } from '../Shared/Button';
import { BankAccount } from '../../types';
import { storageService } from '../../services/storageService';

interface AccountsViewProps {
  onDataChange?: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ onDataChange }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAcc, setNewAcc] = useState({ bankName: '', balance: '' });

  const loadData = () => {
    const data = storageService.getAccounts();
    setAccounts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    if (!newAcc.bankName || !newAcc.balance) return;

    // Normalização numérica brasileira
    let amountStr = newAcc.balance.replace(/\./g, '').replace(',', '.');
    const numericValue = parseFloat(amountStr) || 0;

    const acc: BankAccount = {
      id: crypto.randomUUID(),
      bankName: newAcc.bankName,
      balance: numericValue,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    
    storageService.addAccount(acc);
    loadData();
    if (onDataChange) onDataChange();
    
    setIsModalOpen(false);
    setNewAcc({ bankName: '', balance: '' });
  };

  const handleDelete = (id: string) => {
    storageService.deleteAccount(id);
    loadData();
    if (onDataChange) onDataChange();
  };

  const total = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Meus Bancos</h2>
          <p className="text-slate-500 font-medium">Patrimônio total vinculado: <span className="text-custom-primary font-black">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
        </div>
        <Button variant="primary" className="rounded-2xl h-12 px-6 font-black" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-plus mr-2"></i> Adicionar Banco
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleDelete(acc.id)} 
                className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>
            </div>
            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: acc.color }}>
              {acc.bankName.charAt(0)}
            </div>
            <h3 className="font-black text-slate-900 text-xl mb-1 tracking-tight">{acc.bankName}</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Conta Corrente / Investimento</p>
            <p className="text-3xl font-black text-custom-primary tracking-tight">R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full py-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 text-3xl">
              <i className="fa-solid fa-building-columns"></i>
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">Nenhuma conta bancária vinculada ao NEXO</p>
            <Button variant="ghost" className="mt-4 text-custom-primary font-black text-xs" onClick={() => setIsModalOpen(true)}>Clique para começar</Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-md animate-in zoom-in duration-300 shadow-2xl border border-slate-100">
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Vincular Banco</h3>
            <p className="text-slate-400 text-sm font-medium mb-8">Insira os dados para sincronizar seu saldo.</p>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nome da Instituição</label>
                <input 
                  placeholder="Ex: Nubank, Itaú..." 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-custom-primary focus:bg-white rounded-2xl font-bold outline-none transition-all" 
                  value={newAcc.bankName} 
                  onChange={e => setNewAcc({...newAcc, bankName: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Saldo Disponível (R$)</label>
                <input 
                  placeholder="80,00" 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-custom-primary focus:bg-white rounded-2xl font-bold outline-none transition-all" 
                  value={newAcc.balance} 
                  onChange={e => setNewAcc({...newAcc, balance: e.target.value})} 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="ghost" className="flex-1 rounded-2xl h-16 font-bold" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" className="flex-1 rounded-2xl h-16 font-black shadow-xl" onClick={handleAdd}>Confirmar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
