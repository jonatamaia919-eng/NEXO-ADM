
export const ADMIN_EMAIL = "admin@nexo.com";
export const ADMIN_PASSWORD = "admin123";
export const PIX_KEY = "16997609082";

export const STORAGE_KEYS = {
  USERS: "nexo_users",
  USER_SESSION: "nexo_session",
  ADMIN_SESSION: "nexo_admin_session",
  ACCOUNTS: "nexo_accounts_v1",
  TRANSACTIONS: "nexo_transactions_v1"
};

export const PURPLE_PALETTE = {
  primary: "#6d28d9", // Roxo vibrante
  secondary: "#4c1d95", // Roxo escuro
  accent: "#a78bfa", // Lilás
  light: "#f5f3ff" // Fundo lilás clarinho
};

// Fix: Added missing mock data required for dashboard visualization
export const MOCK_CHART_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Abr', value: 4500 },
  { name: 'Mai', value: 6000 },
  { name: 'Jun', value: 5500 },
];

export const MOCK_TRANSACTIONS = [
  {
    id: '1',
    date: '15/06/2024',
    description: 'Venda Consultoria',
    amount: 1200.00,
    type: 'credit',
    category: 'Receita'
  },
  {
    id: '2',
    date: '14/06/2024',
    description: 'Supermercado Solar',
    amount: 450.20,
    type: 'debit',
    category: 'Alimentação'
  },
  {
    id: '3',
    date: '12/06/2024',
    description: 'Assinatura Netflix',
    amount: 55.90,
    type: 'debit',
    category: 'Entretenimento'
  },
  {
    id: '4',
    date: '10/06/2024',
    description: 'Transferência Recebida',
    amount: 2500.00,
    type: 'credit',
    category: 'Transferência'
  }
];
