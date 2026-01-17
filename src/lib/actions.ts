'use server';

import db from './db';
import { revalidatePath } from 'next/cache';
import { categorizeTransaction } from './categorization';
import { checkRecurring } from './recurring';

export type Transaction = {
    id: number;
    date: string;
    description: string;
    amount: number;
    category: string;
    is_recurring: number;
};

export async function getTransactions() {
    const stmt = db.prepare('SELECT * FROM transactions ORDER BY date DESC');
    return stmt.all() as Transaction[];
}

export async function addTransaction(formData: FormData) {
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const date = formData.get('date') as string;

    if (!description || isNaN(amount) || !date) {
        throw new Error('Invalid input');
    }

    // Auto-categorize
    const category = await categorizeTransaction(description, amount);

    // Check recurring
    const is_recurring = await checkRecurring(description, amount);

    const stmt = db.prepare(`
    INSERT INTO transactions (date, description, amount, category, is_recurring)
    VALUES (@date, @description, @amount, @category, @is_recurring)
  `);

    stmt.run({ date, description, amount, category, is_recurring: is_recurring ? 1 : 0 });
    revalidatePath('/');
}

export async function deleteTransaction(id: number) {
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    stmt.run(id);
    revalidatePath('/');
}

export async function updateTransaction(id: number, formData: FormData) {
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;

    if (!description || isNaN(amount) || !category) {
        throw new Error('Invalid input');
    }

    const stmt = db.prepare(`
    UPDATE transactions 
    SET description = @description, amount = @amount, category = @category
    WHERE id = @id
  `);

    stmt.run({ description, amount, category, id });
    revalidatePath('/');
}

export async function getDashboardStats() {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

    const transactions = await getTransactions();

    let netIncome = 0;
    let totalSpending = 0;
    let subscriptions = 0;

    transactions.forEach((t) => {
        // Filter for current month approx
        if (t.date.startsWith(currentMonth)) {
            if (t.amount > 0) {
                netIncome += t.amount;
            } else {
                netIncome += t.amount; // expense is negative
                totalSpending += Math.abs(t.amount);
            }

            if (t.is_recurring) {
                subscriptions += Math.abs(t.amount);
            }
        }
    });

    return {
        netIncome: netIncome.toFixed(2),
        totalSpending: totalSpending.toFixed(2),
        subscriptions: subscriptions.toFixed(2),
    };
}
