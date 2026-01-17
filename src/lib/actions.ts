'use server';

import { revalidatePath } from 'next/cache';
import { categorizeTransaction } from './categorization';
import { checkRecurring } from './recurring';
import { transactions, setTransactions } from './mockData';

export type Transaction = {
    id: number;
    date: string;
    description: string;
    amount: number;
    category: string;
    is_recurring: number;
};

// ... other functions ...

export async function getTransactions() {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addTransaction(formData: FormData) {
    // ... existing implementation
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const date = formData.get('date') as string;

    if (!description || isNaN(amount) || !date) {
        throw new Error('Invalid input');
    }

    const category = await categorizeTransaction(description, amount);
    const is_recurring = await checkRecurring(description, amount);

    const newTx = {
        id: Math.floor(Math.random() * 100000),
        date,
        description,
        amount,
        category,
        is_recurring: is_recurring ? 1 : 0
    };

    setTransactions([newTx, ...transactions]);
    revalidatePath('/');
}

export async function deleteTransaction(id: number) {
    const filtered = transactions.filter(t => t.id !== id);
    setTransactions(filtered);
    revalidatePath('/');
}

export async function updateTransaction(id: number, formData: FormData) {
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;

    if (!description || isNaN(amount) || !category) {
        throw new Error('Invalid input');
    }

    const updatedIndex = transactions.findIndex(t => t.id === id);
    if (updatedIndex > -1) {
        const updatedTx = { ...transactions[updatedIndex], description, amount, category };
        const newAll = [...transactions];
        newAll[updatedIndex] = updatedTx;
        setTransactions(newAll);
    }
    revalidatePath('/');
}

export async function getDashboardStats() {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    let targetTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
    if (targetTransactions.length === 0) targetTransactions = transactions;

    let totalIncome = 0;
    let netIncome = 0;
    let totalSpending = 0;
    let subscriptions = 0;

    targetTransactions.forEach((t) => {
        if (t.amount > 0) {
            netIncome += t.amount;
            totalIncome += t.amount;
        } else {
            netIncome += t.amount;
            totalSpending += Math.abs(t.amount);
        }

        if (t.is_recurring) {
            subscriptions += Math.abs(t.amount);
        }
    });

    return {
        totalIncome: totalIncome.toFixed(2),
        netIncome: netIncome.toFixed(2),
        totalSpending: totalSpending.toFixed(2),
        subscriptions: subscriptions.toFixed(2),
    };
}
