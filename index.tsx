
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { storageService } from './services/storageService';

// Initialize with some mock users if empty
const init = () => {
  const users = storageService.getUsers();
  if (users.length === 0) {
    // SEU ACESSO ADM
    storageService.createUser({
      id: 'admin-master',
      name: 'Administrador Nexo',
      email: 'admin@nexo.com',
      password: 'admin123',
      active: true,
      role: 'admin'
    });
    
    // Usuários de teste
    storageService.createUser({
      id: 'mock-1',
      name: 'João Developer',
      email: 'joao@example.com',
      password: 'password123',
      active: true,
      role: 'user'
    });
    storageService.createUser({
      id: 'mock-2',
      name: 'Maria Tester',
      email: 'maria@example.com',
      password: 'password123',
      active: false,
      role: 'user'
    });
  }
};

init();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
