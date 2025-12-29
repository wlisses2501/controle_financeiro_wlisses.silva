
import { Transaction, User } from '../types';

const TRANSACTIONS_KEY = 'controlfin_transactions';
const USERS_KEY = 'controlfin_users';
const CURRENT_USER_KEY = 'controlfin_current_user';

export const storage = {
  getTransactions: (email: string): Transaction[] => {
    const data = localStorage.getItem(`${TRANSACTIONS_KEY}_${email}`);
    return data ? JSON.parse(data) : [];
  },
  saveTransactions: (email: string, transactions: Transaction[]) => {
    localStorage.setItem(`${TRANSACTIONS_KEY}_${email}`, JSON.stringify(transactions));
  },
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: User) => {
    const users = storage.getUsers();
    if (!users.find(u => u.email === user.email)) {
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }
};
