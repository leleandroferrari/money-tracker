const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'finance.db');
const db = new Database(dbPath);

console.log('Seeding database...');

// Clear existing
db.exec('DELETE FROM transactions');

const insertStmt = db.prepare(`
  INSERT INTO transactions (date, description, amount, category, is_recurring)
  VALUES (@date, @description, @amount, @category, @is_recurring)
`);

const now = new Date();
const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM
const today = now.toISOString().slice(0, 10);

const transactions = [
    // Income
    { date: today, description: 'Client invoice', amount: 12000, category: 'Income', is_recurring: 0 },
    { date: today, description: 'Consulting work', amount: 8500, category: 'Income', is_recurring: 0 },

    // Expenses
    { date: today, description: 'Office rent', amount: -2200, category: 'Office', is_recurring: 1 },
    { date: today, description: 'Adobe subscription', amount: -79, category: 'Software', is_recurring: 1 },
    { date: today, description: 'Google Workspace', amount: -23, category: 'Software', is_recurring: 1 },
    { date: today, description: 'Notion subscription', amount: -12, category: 'Software', is_recurring: 1 },
    { date: today, description: 'Health insurance', amount: -480, category: 'Insurance', is_recurring: 1 },
    { date: today, description: 'Phone plan', amount: -65, category: 'Utilities', is_recurring: 1 },
    { date: today, description: 'Cloud hosting', amount: -110, category: 'Hosting', is_recurring: 1 },
    { date: today, description: 'Online ads', amount: -650, category: 'Marketing', is_recurring: 0 },
    { date: today, description: 'Client lunch', amount: -96, category: 'Meals', is_recurring: 0 },
    { date: today, description: 'Transport', amount: -48, category: 'Transport', is_recurring: 0 },
    { date: today, description: 'Office supplies', amount: -180, category: 'Office', is_recurring: 0 },
];

transactions.forEach(t => insertStmt.run(t));

console.log('Seeding completed!');
