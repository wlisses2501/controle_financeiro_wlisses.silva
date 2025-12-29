
import React, { useState, useEffect, useMemo } from 'react';
import { AuthState, Transaction, TransactionType, User } from './types';
import { storage } from './services/storage';
import { Icons } from './constants';
import { supabase } from './lib/supabase';
import { transactionService } from './services/transactionService';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionsList from './components/TransactionsList';

import Modal from './components/Modal';

type Tab = 'dashboard' | 'income' | 'expense' | 'reserve';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateSession(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        updateSession(session.user);
      } else {
        console.log("Logged out");
        setAuth({ isAuthenticated: false, user: null });
        setActiveTab('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateSession = (supabaseUser: any) => {
    const user: User = {
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || 'Usuário'
    };
    setAuth({ isAuthenticated: true, user });
    // We continue to use local storage for transactions for now, keyed by email
    setTransactions(storage.getTransactions(user.email));
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    // State update is handled by onAuthStateChange
    setIsSidebarOpen(false);
  };

  const addTransaction = async (data: any, type: TransactionType) => {
    if (!auth.user) return;
    try {
      const newTransaction = await transactionService.addTransaction({ ...data, type });
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert('Erro ao salvar transação.');
    }
  };

  const updateTransaction = async (data: any) => {
    if (!auth.user || !editingTransaction) return;

    try {
      const updated = await transactionService.updateTransaction(editingTransaction.id, data);
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? updated : t));
      closeEditModal();
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert('Erro ao atualizar transação.');
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!auth.user) return;
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert('Erro ao excluir transação.');
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
    setIsEditModalOpen(false);
  };

  if (!auth.isAuthenticated) {
    return <Auth onLogin={() => { }} />;
  }

  const SidebarContent = () => (
    <>
      <div className="p-8">
        <h1 className="text-xl font-black text-accent-orange flex items-center gap-2">
          Controle Financeiro <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        </h1>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">Gestão Inteligente</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-primary-blue text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <Icons.Dashboard />
          <span className="font-semibold">Dashboard</span>
        </button>
        <button
          onClick={() => { setActiveTab('income'); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'income' ? 'bg-primary-blue text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <Icons.Incomes />
          <span className="font-semibold">Entradas</span>
        </button>
        <button
          onClick={() => { setActiveTab('expense'); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'expense' ? 'bg-primary-blue text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <Icons.Expenses />
          <span className="font-semibold">Saídas</span>
        </button>
        <button
          onClick={() => { setActiveTab('reserve'); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'reserve' ? 'bg-primary-blue text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <Icons.PiggyBank />
          <span className="font-semibold">Reservas</span>
        </button>
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="mb-4 px-2">
          <p className="text-xs text-gray-400">Olá,</p>
          <p className="text-sm font-bold truncate">{auth.user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-semibold"
        >
          <Icons.Logout />
          Sair do Sistema
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-light-gray flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-dark-blue text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-orange"></span>
          <span className="font-bold text-lg">Controle Financeiro</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-dark-blue to-black text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && <Dashboard transactions={transactions} user={auth.user} />}

        {activeTab === 'income' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-dark-blue">Minhas Receitas</h2>
            <TransactionForm type={TransactionType.INCOME} onSubmit={(data) => addTransaction(data, TransactionType.INCOME)} />
            <TransactionsList
              transactions={transactions}
              type={TransactionType.INCOME}
              onDelete={deleteTransaction}
              onEdit={openEditModal}
            />
          </div>
        )}

        {activeTab === 'expense' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-dark-blue">Minhas Despesas</h2>
            <TransactionForm type={TransactionType.EXPENSE} onSubmit={(data) => addTransaction(data, TransactionType.EXPENSE)} />
            <TransactionsList
              transactions={transactions}
              type={TransactionType.EXPENSE}
              onDelete={deleteTransaction}
              onEdit={openEditModal}
            />
          </div>
        )}

        {activeTab === 'reserve' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-dark-blue">Minhas Reservas</h2>
            <TransactionForm type={TransactionType.RESERVE} onSubmit={(data) => addTransaction(data, TransactionType.RESERVE)} />
            <TransactionsList
              transactions={transactions}
              type={TransactionType.RESERVE}
              onDelete={deleteTransaction}
              onEdit={openEditModal}
            />
          </div>
        )}
      </main>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title={`Editar ${editingTransaction?.type === TransactionType.INCOME
          ? 'Entrada'
          : editingTransaction?.type === TransactionType.EXPENSE
            ? 'Saída'
            : 'Reserva'
          }`}
      >
        {editingTransaction && (
          <TransactionForm
            type={editingTransaction.type}
            initialData={editingTransaction}
            onSubmit={updateTransaction}
            onCancel={closeEditModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default App;
