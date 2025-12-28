
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  role: 'admin' | 'user';
}

export enum AppRoute {
  APP_LOGIN = 'APP_LOGIN',
  APP_DASHBOARD = 'APP_DASHBOARD',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  SWITCHER = 'SWITCHER'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}
