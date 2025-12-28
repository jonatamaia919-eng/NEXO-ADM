
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

export enum AppRoute {
  SWITCHER = 'SWITCHER',
  REGISTRATION = 'REGISTRATION',
  ONBOARDING = 'ONBOARDING',
  PAYMENT = 'PAYMENT',
  APP_DASHBOARD = 'APP_DASHBOARD',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
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
