
export const ADMIN_EMAIL = "admin@nexo.com";
export const ADMIN_PASSWORD = "nexoadm123";

export const STORAGE_KEYS = {
  USERS: "nexo_users",
  USER_SESSION: "nexo_session",
  ADMIN_SESSION: "nexo_admin_session"
};

export const MOCK_CHART_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export const MOCK_TRANSACTIONS = [
  { id: '1', date: '2023-10-01', description: 'Amazon Order', amount: 150.00, type: 'debit', category: 'Shopping' },
  { id: '2', date: '2023-10-02', description: 'Monthly Salary', amount: 3500.00, type: 'credit', category: 'Work' },
  { id: '3', date: '2023-10-03', description: 'Coffee Shop', amount: 4.50, type: 'debit', category: 'Food' },
  { id: '4', date: '2023-10-05', description: 'Netflix Subscription', amount: 15.99, type: 'debit', category: 'Entertainment' },
  { id: '5', date: '2023-10-07', description: 'Freelance Work', amount: 800.00, type: 'credit', category: 'Work' },
];
