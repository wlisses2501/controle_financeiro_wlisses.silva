import React, { useState, useEffect } from 'react';
import { TransactionType, IncomeCategory, ExpenseCategory } from '../../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, RESERVE_CATEGORIES, Icons } from '../constants';

interface TransactionFormProps {
  type: TransactionType;
  initialData?: {
    id?: string;
    amount: number;
    category: any;
    description: string;
    date: string;
  };
  onSubmit: (transaction: {
    category: any;
    amount: number;
    description: string;
    date: string;
  }) => void;
  onCancel?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, initialData, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(
    type === TransactionType.INCOME ? INCOME_CATEGORIES[0]
      : type === TransactionType.EXPENSE ? EXPENSE_CATEGORIES[0]
        : RESERVE_CATEGORIES[0]
  );
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDescription(initialData.description);
      setDate(initialData.date.split('T')[0]); // Ensure date format matches input
    } else {
      // Reset category when type changes if not editing
      setCategory(
        type === TransactionType.INCOME ? INCOME_CATEGORIES[0]
          : type === TransactionType.EXPENSE ? EXPENSE_CATEGORIES[0]
            : RESERVE_CATEGORIES[0]
      );
    }
  }, [initialData, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onSubmit({
      amount: Number(amount),
      category,
      description,
      date
    });

    if (!initialData) {
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  const getCategories = () => {
    switch (type) {
      case TransactionType.INCOME: return INCOME_CATEGORIES;
      case TransactionType.EXPENSE: return EXPENSE_CATEGORIES;
      case TransactionType.RESERVE: return RESERVE_CATEGORIES;
      default: return [];
    }
  }

  const getButtonClass = () => {
    switch (type) {
      case TransactionType.INCOME: return 'bg-primary-blue hover:bg-navy';
      case TransactionType.EXPENSE: return 'bg-accent-orange hover:opacity-90';
      case TransactionType.RESERVE: return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-gray-500';
    }
  }

  const getButtonLabel = () => {
    if (initialData) return 'Salvar Alterações';
    switch (type) {
      case TransactionType.INCOME: return 'Adicionar Entrada';
      case TransactionType.EXPENSE: return 'Adicionar Saída';
      case TransactionType.RESERVE: return 'Adicionar Reserva';
      default: return 'Adicionar';
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none"
            placeholder="0,00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none"
          >
            {getCategories().map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none"
            placeholder="Ex: Aluguel, Mercado..."
          />
        </div>
      </div>
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-lg text-gray-600 font-semibold transition-all border border-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold transition-all shadow-lg ${getButtonClass()}`}
        >
          <Icons.Plus />
          {getButtonLabel()}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
