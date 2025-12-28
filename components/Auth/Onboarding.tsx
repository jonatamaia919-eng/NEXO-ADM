
import React, { useState } from 'react';
import { Button } from '../Shared/Button';
import { User } from '../../types';

export const Onboarding: React.FC<{ user: User, onComplete: () => void }> = ({ user, onComplete }) => {
  const [step, setStep] = useState(0);
  const questions = [
    { q: "Você costuma anotar seus gastos atualmente?", options: ["Sim", "Não"] },
    { q: "O que mais pesa no seu bolso hoje?", options: ["Cartão de crédito", "Gastos do dia a dia", "Falta de controle", "Tudo isso 😅"] },
    { q: "Seu objetivo com o NEXO é:", options: ["Organizar melhor meu dinheiro", "Economizar", "Entender onde estou gastando demais"] }
  ];

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setStep(questions.length);
  };

  if (step === questions.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Quase lá, {user.name.split(' ')[0]}!</h2>
          <p className="text-slate-600 font-medium mb-10 leading-relaxed">
            Com base no seu perfil, o NEXO pode te ajudar a ter mais controle e clareza sobre seu dinheiro.
          </p>
          <Button variant="primary" size="lg" className="w-full bg-purple-600 rounded-2xl h-16 font-black text-lg" onClick={onComplete}>
            Continuar para Planos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="w-full bg-slate-100 h-2 rounded-full mb-10 overflow-hidden">
          <div className="bg-purple-600 h-full transition-all duration-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-8 leading-tight">{questions[step].q}</h2>
        <div className="space-y-3">
          {questions[step].options.map(opt => (
            <button key={opt} onClick={handleNext} className="w-full p-5 text-left rounded-2xl bg-slate-50 border-2 border-transparent hover:border-purple-600 hover:bg-purple-50 transition-all font-bold text-slate-700">
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
