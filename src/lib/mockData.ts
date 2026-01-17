export let transactions = [
    { id: 1, date: '2026-01-15', description: 'Client Payment - Tech Corp', amount: 12500.00, category: 'Income', is_recurring: 0 },
    { id: 2, date: '2026-01-16', description: 'Office Rent', amount: -2400.00, category: 'Office', is_recurring: 1 },
    { id: 3, date: '2026-01-14', description: 'Apple Store', amount: -2499.00, category: 'Equipment', is_recurring: 0 },
    { id: 4, date: '2026-01-12', description: 'Adobe Creative Cloud', amount: -65.00, category: 'Software', is_recurring: 1 },
    { id: 5, date: '2026-01-10', description: 'Uber Eats', amount: -45.50, category: 'Meals', is_recurring: 0 },
    { id: 6, date: '2026-01-08', description: 'Consulting Session', amount: 1500.00, category: 'Income', is_recurring: 0 },
    { id: 7, date: '2026-01-05', description: 'Vercel Pro', amount: -20.00, category: 'Software', is_recurring: 1 },
];

export function setTransactions(newTransactions: any[]) {
    transactions = newTransactions;
}
