
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { Icons, MONTHS } from '../constants';

interface TransactionsListProps {
  transactions: Transaction[];
  type: TransactionType;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, type, onDelete, onEdit }) => {
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth());
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i); // Current year - 1 to +3

  const filtered = transactions
    .filter(t => t.type === type)
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6 animate-fadeIn">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-dark-blue">
          {type === TransactionType.INCOME ? 'Registros de Entradas'
            : type === TransactionType.EXPENSE ? 'Registros de Saídas'
              : 'Registros de Reservas'}
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium outline-none text-primary-blue"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium outline-none text-primary-blue"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-right">Valor</th>
              <th className="px-6 py-3 text-center w-28">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDate(t.date)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-dark-blue">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${type === TransactionType.INCOME ? 'bg-green-100 text-green-700'
                      : type === TransactionType.EXPENSE ? 'bg-orange-100 text-orange-700'
                        : 'bg-purple-100 text-purple-700'
                      }`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{t.description || '-'}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${type === TransactionType.INCOME ? 'text-green-600'
                    : type === TransactionType.EXPENSE ? 'text-red-500'
                      : 'text-purple-600'
                    }`}>
                    {type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-1">
                    <button
                      onClick={() => onEdit(t)}
                      className="text-gray-400 hover:text-blue-500 p-1.5 hover:bg-blue-50 rounded-full transition-all"
                      title="Editar"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-all"
                      title="Excluir"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                  Nenhum registro encontrado para este período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;
