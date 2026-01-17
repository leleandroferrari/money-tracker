'use server';

import { getTransactions, getDashboardStats } from './actions';

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export async function askFinanceAI(query: string): Promise<string> {
    const q = query.toLowerCase();
    const transactions = await getTransactions();
    const stats = await getDashboardStats();

    // 1. Overview / Stats
    if (q.includes('spend') && (q.includes('total') || q.includes('all'))) {
        return `Your total spending across all records is CHF ${stats.totalSpending}.`;
    }
    if (q.includes('income') || q.includes('made')) {
        return `Your total income is CHF ${stats.totalIncome}.`;
    }
    if (q.includes('save') || q.includes('savings') || q.includes('net')) {
        return `Your net savings are currently CHF ${stats.netIncome}.`;
    }
    if (q.includes('subscription') || q.includes('recurring')) {
        return `You are spending CHF ${stats.subscriptions} on recurring subscriptions.`;
    }

    // 2. Specific Categories (Food, Tech, etc.)
    if (q.includes('food') || q.includes('eat') || q.includes('lunch')) {
        const food = transactions.filter(t =>
            t.description.toLowerCase().includes('food') ||
            t.description.toLowerCase().includes('eat') ||
            t.description.toLowerCase().includes('uber') ||
            t.description.toLowerCase().includes('lunch')
        );
        const total = food.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return `You've spent a total of CHF ${total.toFixed(2)} on food/dining based on your recent transactions.`;
    }

    if (q.includes('software') || q.includes('tech') || q.includes('adobe')) {
        const tech = transactions.filter(t => t.category === 'Software' || t.description.toLowerCase().includes('tech'));
        const total = tech.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return `Your total tech and software spending is CHF ${total.toFixed(2)}.`;
    }

    // 3. Highest/Lowest
    if (q.includes('highest') || q.includes('biggest')) {
        const expense = transactions
            .filter(t => t.amount < 0)
            .sort((a, b) => a.amount - b.amount)[0]; // Most negative

        if (expense) return `Your biggest expense was "${expense.description}" for CHF ${Math.abs(expense.amount).toFixed(2)}.`;
        return "I couldn't find any expenses.";
    }

    // Default Fallback
    return "I can help with your finances! Ask me about your 'total spending', 'income', 'food expenses', or 'subscriptions'.";
}
