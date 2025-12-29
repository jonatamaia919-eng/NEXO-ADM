
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  active: boolean;
  role: 'admin' | 'user';
  hasPaid?: boolean;
  onboardingComplete?: boolean;
}

export interface AppTheme {
  primary: string;
  secondary: string;
}

export enum AppRoute {
  SWITCHER = 'SWITCHER',
  LOGIN = 'LOGIN',
  APP_DASHBOARD = 'APP_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface BankAccount {
  id: string;
  bankName: string;
  balance: number;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}
