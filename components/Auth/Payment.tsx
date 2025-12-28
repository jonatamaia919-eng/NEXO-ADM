
import React, { useState } from 'react';
import { Button } from '../Shared/Button';
import { User } from '../../types';
import { PIX_KEY } from '../../constants';

export const Payment: React.FC<{ user: User, onPaymentSuccess: () => void }> = ({ user, onPaymentSuccess }) => {
  const [method, setMethod] = useState<'pix' | 'card'>('pix');
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      onPaymentSuccess();
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Escolha seu plano</h1>
          <p className="text-slate-500 font-medium mt-2">Acesso ilimitado a todas as ferramentas do NEXO.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl transition-shadow cursor-pointer">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Plano Mensal</p>
            <h3 className="text-4xl font-black text-slate-900 mb-6">R$ 29,90 <span className="text-sm text-slate-400">/mês</span></h3>
            <ul className="space-y-3 text-sm font-bold text-slate-600">
              <li><i className="fa-solid fa-check text-purple-600 mr-2"></i> Gestão de Contas</li>
              <li><i className="fa-solid fa-check text-purple-600 mr-2"></i> Gráficos Analíticos</li>
            </ul>
          </div>
          <div className="bg-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-purple-100 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Mais Vantajoso</div>
            <p className="text-xs font-black text-purple-200 uppercase tracking-widest mb-2">Plano Anual</p>
            <h3 className="text-4xl font-black mb-6">R$ 199,90 <span className="text-sm opacity-60">/ano</span></h3>
            <ul className="space-y-3 text-sm font-bold opacity-90">
              <li><i className="fa-solid fa-check mr-2"></i> Tudo do Mensal</li>
              <li><i className="fa-solid fa-check mr-2"></i> Suporte Prioritário</li>
              <li><i className="fa-solid fa-star mr-2"></i> Economia de 40%</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-2xl mx-auto">
          <div className="flex gap-4 mb-8">
            <button onClick={() => setMethod('pix')} className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${method === 'pix' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>PIX</button>
            <button onClick={() => setMethod('card')} className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${method === 'card' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>Cartão</button>
          </div>

          {method === 'pix' ? (
            <div className="text-center space-y-6">
              <div className="w-48 h-48 bg-slate-100 mx-auto rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
                <i className="fa-solid fa-qrcode text-6xl text-slate-300"></i>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase mb-2">Chave PIX</p>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="flex-1 font-black text-slate-900 text-lg">{PIX_KEY}</span>
                  <button onClick={() => { navigator.clipboard.writeText(PIX_KEY); alert('Copiado!'); }} className="text-purple-600 font-bold text-sm">Copiar</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input placeholder="Número do Cartão" className="w-full px-6 py-4 bg-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-600" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="MM/AA" className="w-full px-6 py-4 bg-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-600" />
                <input placeholder="CVV" className="w-full px-6 py-4 bg-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-600" />
              </div>
              <input placeholder="Nome no Cartão" className="w-full px-6 py-4 bg-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-600" />
            </div>
          )}

          <Button variant="primary" loading={loading} className="w-full h-16 mt-10 bg-purple-600 hover:bg-purple-700 rounded-2xl font-black text-xl shadow-lg shadow-purple-100" onClick={handleConfirm}>
            Assinar Agora
          </Button>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-6 tracking-widest"><i className="fa-solid fa-lock mr-2"></i> Pagamento 100% Seguro</p>
        </div>
      </div>
    </div>
  );
};
