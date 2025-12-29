
import { User, AppTheme } from '../types';
import { STORAGE_KEYS, DEFAULT_THEME } from '../constants';

export const storageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  createUser: (user: User) => {
    const users = storageService.getUsers();
    if (users.some(u => u.email === user.email)) {
      alert('E-mail já cadastrado no sistema.');
      return;
    }
    users.push(user);
    storageService.setUsers(users);
  },

  updateUser: (updatedUser: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storageService.setUsers(users);
    }
  },

  toggleUserStatus: (id: string) => {
    const users = storageService.getUsers();
    const updated = users.map((u: User) =>
      u.id === id ? { ...u, active: !u.active } : u
    );
    storageService.setUsers(updated);
  },

  resetPassword: (id: string, newPassword: string) => {
    const users = storageService.getUsers();
    const updated = users.map((u: User) =>
      u.id === id ? { ...u, password: newPassword } : u
    );
    storageService.setUsers(updated);
  },

  deleteUser: (id: string) => {
    const users = storageService.getUsers();
    const filtered = users.filter(u => u.id !== id);
    storageService.setUsers(filtered);
    
    const currentSession = storageService.getSession();
    if (currentSession && currentSession.id === id) {
      storageService.clearSession();
    }
  },

  getSession: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return data ? JSON.parse(data) : null;
  },

  setSession: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  },

  setAdminSession: (isAdmin: boolean) => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(isAdmin));
  },

  getAdminSession: (): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return data ? JSON.parse(data) : false;
  },

  getTheme: (): AppTheme => {
    const data = localStorage.getItem(STORAGE_KEYS.THEME);
    return data ? JSON.parse(data) : DEFAULT_THEME;
  },

  setTheme: (theme: AppTheme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
  }
};
