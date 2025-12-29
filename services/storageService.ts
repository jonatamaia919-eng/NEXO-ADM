
import { User, AppTheme, BankAccount, Transaction } from '../types';
import { STORAGE_KEYS, DEFAULT_THEME } from '../constants';

export const storageService = {
  // Usuários e Sessões
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  setUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
  createUser: (user: User) => {
    const users = storageService.getUsers();
    if (users.some(u => u.email === user.email)) return;
    users.push(user);
    storageService.setUsers(users);
  },
  toggleUserStatus: (id: string) => {
    const users = storageService.getUsers();
    storageService.setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  },
  resetPassword: (id: string, pass: string) => {
    const users = storageService.getUsers();
    storageService.setUsers(users.map(u => u.id === id ? { ...u, password: pass } : u));
  },
  deleteUser: (id: string) => {
    storageService.setUsers(storageService.getUsers().filter(u => u.id !== id));
  },
  getSession: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return data ? JSON.parse(data) : null;
  },
  setSession: (user: User) => localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user)),
  clearSession: () => localStorage.removeItem(STORAGE_KEYS.USER_SESSION),
  setAdminSession: (isAdmin: boolean) => localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(isAdmin)),
  getAdminSession: (): boolean => JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) || 'false'),

  // Tema
  getTheme: (): AppTheme => JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME) || JSON.stringify(DEFAULT_THEME)),
  setTheme: (theme: AppTheme) => localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme)),

  // Contas Bancárias
  getAccounts: (): BankAccount[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '[]'),
  saveAccounts: (accounts: BankAccount[]) => localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts)),
  addAccount: (account: BankAccount) => {
    const accounts = storageService.getAccounts();
    accounts.push(account);
    storageService.saveAccounts(accounts);
  },
  updateAccountBalance: (accountId: string, amount: number, type: 'credit' | 'debit') => {
    const accounts = storageService.getAccounts();
    const updated = accounts.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, balance: type === 'credit' ? acc.balance + amount : acc.balance - amount };
      }
      return acc;
    });
    storageService.saveAccounts(updated);
  },
  deleteAccount: (id: string) => {
    storageService.saveAccounts(storageService.getAccounts().filter(a => a.id !== id));
  },

  // Transações (Gastos/Receitas)
  getTransactions: (): Transaction[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]'),
  addTransaction: (tx: Transaction, accountId: string) => {
    const transactions = storageService.getTransactions();
    transactions.unshift(tx); // Adiciona no início da lista
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    
    // Atualiza o saldo do banco vinculado
    storageService.updateAccountBalance(accountId, tx.amount, tx.type);
  }
};
