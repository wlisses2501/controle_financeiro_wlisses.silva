
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export const transactionService = {
    async getTransactions() {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data as Transaction[];
    },

    async addTransaction(transaction: Omit<Transaction, 'id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                ...transaction,
                user_id: user.id
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    async updateTransaction(id: string, updates: Partial<Transaction>) {
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    async deleteTransaction(id: string) {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
