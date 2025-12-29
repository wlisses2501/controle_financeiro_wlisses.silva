
import React, { useMemo, useEffect, useState } from 'react';
import { Transaction, TransactionType, User } from '../types';
import { MONTHS, Icons } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';


interface DashboardProps {
  transactions: Transaction[];
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, user }) => {

  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i); // Current year - 1 to +3

  const COLORS = ['#121040', '#052A59', '#F28705', '#22c55e', '#ef4444', '#a855f7', '#eab308', '#06b6d4'];

  const stats = useMemo(() => {
    const currentMonth = selectedMonth;
    const currentYear = selectedYear;

    const monthlyTrans = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, curr) => acc + curr.amount, 0);
    const totalReserve = transactions.filter(t => t.type === TransactionType.RESERVE).reduce((acc, curr) => acc + curr.amount, 0);

    const monthlyIncome = monthlyTrans.filter(t => t.type === TransactionType.INCOME).reduce((acc, curr) => acc + curr.amount, 0);
    const monthlyExpense = monthlyTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, curr) => acc + curr.amount, 0);
    const monthlyReserve = monthlyTrans.filter(t => t.type === TransactionType.RESERVE).reduce((acc, curr) => acc + curr.amount, 0);

    // Grouping for charts
    const chartData = MONTHS.map((name, index) => {
      const monthData = transactions.filter(t => new Date(t.date).getMonth() === index && new Date(t.date).getFullYear() === currentYear);
      return {
        name,
        Entradas: monthData.filter(t => t.type === TransactionType.INCOME).reduce((acc, curr) => acc + curr.amount, 0),
        Saídas: monthData.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, curr) => acc + curr.amount, 0),
        Reservas: monthData.filter(t => t.type === TransactionType.RESERVE).reduce((acc, curr) => acc + curr.amount, 0),
      };
    });

    const pieData = Object.entries(
      monthlyTrans
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    // Balance Evolution Data
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const balanceData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const transactionsUpToDay = monthlyTrans.filter(t => new Date(t.date).getDate() <= day);

      const income = transactionsUpToDay.filter(t => t.type === TransactionType.INCOME).reduce((acc, curr) => acc + curr.amount, 0);
      const expense = transactionsUpToDay.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, curr) => acc + curr.amount, 0);
      const reserve = transactionsUpToDay.filter(t => t.type === TransactionType.RESERVE).reduce((acc, curr) => acc + curr.amount, 0);

      return {
        day: day.toString(),
        saldo: income - expense - reserve
      };
    });

    return { totalIncome, totalExpense, totalReserve, monthlyIncome, monthlyExpense, monthlyReserve, chartData, pieData, balanceData };
  }, [transactions, selectedMonth, selectedYear]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);


  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-dark-blue">Visão Geral</h2>
          <p className="text-gray-500 mt-1">Olá, <span className="font-bold text-primary-blue">{user?.name}</span>. Aqui está o resumo das suas finanças.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-500 px-2">Período:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-transparent outline-none font-semibold text-primary-blue cursor-pointer border-r border-gray-200 pr-2 mr-2"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent outline-none font-semibold text-primary-blue cursor-pointer"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-medium text-sm">Entradas ({MONTHS[selectedMonth]})</span>
            <div className="p-2 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
              <Icons.ArrowUp />
            </div>
          </div>
          <div className="text-2xl font-bold text-dark-blue">{formatCurrency(stats.monthlyIncome)}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-medium text-sm">Saídas ({MONTHS[selectedMonth]})</span>
            <div className="p-2 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
              <Icons.ArrowDown />
            </div>
          </div>
          <div className="text-2xl font-bold text-dark-blue">{formatCurrency(stats.monthlyExpense)}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-medium text-sm">Reservado (Total)</span>
            <div className="p-2 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors">
              <Icons.PiggyBank />
            </div>
          </div>
          <div className="text-2xl font-bold text-dark-blue">{formatCurrency(stats.totalReserve)}</div>
        </div>
        <div className="bg-gradient-to-br from-dark-blue to-primary-blue p-6 rounded-3xl shadow-lg text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
            <Icons.Dashboard />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="opacity-80 font-medium text-sm">Saldo Disponível</span>
          </div>
          <div className="text-3xl font-bold relative z-10">{formatCurrency(stats.totalIncome - stats.totalExpense - stats.totalReserve)}</div>
        </div>
      </div>

      {/* Gráfico de Evolução de Saldo */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-dark-blue mb-6">Evolução do Saldo ({MONTHS[selectedMonth]})</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.balanceData}>
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#052A59" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#052A59" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area type="monotone" dataKey="saldo" stroke="#052A59" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras Mensal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-dark-blue mb-6">Fluxo Anual de Caixa</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Entradas" fill="#052A59" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Saídas" fill="#F28705" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza por Categoria */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-dark-blue mb-6">Gastos por Categoria ({MONTHS[selectedMonth]})</h3>
          <div className="h-[300px]">
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                Nenhuma despesa registrada neste mês.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-dark-blue">Histórico de Lançamentos ({MONTHS[selectedMonth]})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Descrição</th>
                <th className="px-6 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions
                .filter(t => {
                  const d = new Date(t.date);
                  return d.getMonth() === selectedMonth && d.getFullYear() === new Date().getFullYear();
                })
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .length > 0 ? (
                transactions
                  .filter(t => {
                    const d = new Date(t.date);
                    return d.getMonth() === selectedMonth && d.getFullYear() === new Date().getFullYear();
                  })
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${t.type === TransactionType.INCOME ? 'bg-green-100 text-green-700'
                          : t.type === TransactionType.EXPENSE ? 'bg-orange-100 text-orange-700'
                            : 'bg-purple-100 text-purple-700'
                          } `}>
                          {t.type === TransactionType.INCOME ? 'Entrada'
                            : t.type === TransactionType.EXPENSE ? 'Saída'
                              : 'Reserva'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-dark-blue">{t.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{t.description || '-'}</td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === TransactionType.INCOME ? 'text-green-600'
                        : t.type === TransactionType.EXPENSE ? 'text-red-500'
                          : 'text-purple-600'
                        } `}>
                        {t.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    Nenhum lançamento neste período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
