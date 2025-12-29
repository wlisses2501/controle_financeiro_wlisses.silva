
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  RESERVE = 'RESERVE'
}

export type IncomeCategory = 'Salário' | 'Vale Alimentação';
export type ExpenseCategory = 'Mercado' | 'Água' | 'Luz' | 'Gás' | 'Plano Celular' | 'Transporte' | 'Lazer' | 'Outras';
export type ReserveCategory = 'Reserva de Emergência' | 'Metas' | 'Investimentos' | 'Outros';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory | ReserveCategory;
  amount: number;
  date: string;
  description: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
