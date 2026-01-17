'use client';

import React, { useState } from 'react';
import { Transaction, deleteTransaction, updateTransaction } from '@/lib/actions';
import styles from './TransactionList.module.css';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import PDFReport from './PDFReport';

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);

    // Edit state
    const [editForm, setEditForm] = useState({ description: '', amount: '0', category: '' });

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };

    const startEdit = (t: Transaction) => {
        setEditingId(t.id);
        setEditForm({ description: t.description, amount: t.amount.toString(), category: t.category });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = async (id: number) => {
        const formData = new FormData();
        formData.append('description', editForm.description);
        formData.append('amount', editForm.amount);
        formData.append('category', editForm.category);

        await updateTransaction(id, formData);
        setEditingId(null);
    };

    const getIcon = (category: string, description: string) => {
        const desc = description.toLowerCase();
        if (desc.includes('food') || desc.includes('lunch') || desc.includes('coffee') || desc.includes('uber') || desc.includes('meal')) return '🍔';
        if (desc.includes('tech') || desc.includes('software') || desc.includes('samsic') || desc.includes('digital')) return '💻';
        if (desc.includes('rent') || desc.includes('office')) return '🏢';
        if (desc.includes('apple') || desc.includes('mac')) return '🍎';
        if (desc.includes('adobe')) return '🎨';
        if (category === 'Income') return '💰';
        if (category === 'Transport') return '🚗';
        return '📄';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Recent Transactions</h2>
                <div>
                    <PDFReport transactions={transactions} />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id}>
                                <td>{new Date(t.date).toLocaleDateString()}</td>

                                {editingId === t.id ? (
                                    <>
                                        <td>
                                            <input
                                                className={styles.input}
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={styles.input}
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={styles.input}
                                                type="number"
                                                value={editForm.amount}
                                                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => saveEdit(t.id)} className={styles.iconBtn} style={{ color: 'green' }}>
                                                <Check size={18} />
                                            </button>
                                            <button onClick={cancelEdit} className={styles.iconBtn} style={{ color: 'red' }}>
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            <div className={styles.desc}>
                                                <span style={{ fontSize: '1.2rem' }}>{getIcon(t.category, t.description)}</span>
                                                {t.description}
                                                {Boolean(t.is_recurring) && <span className={styles.badge}>Recurring</span>}
                                            </div>
                                        </td>
                                        <td>{t.category}</td>
                                        <td className={t.amount > 0 ? styles.income : styles.expense}>
                                            CHF {t.amount.toFixed(2)}
                                        </td>
                                        <td>
                                            <button onClick={() => startEdit(t)} className={styles.iconBtn}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(t.id)} className={styles.iconBtn}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No transactions found. Import or add some!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
