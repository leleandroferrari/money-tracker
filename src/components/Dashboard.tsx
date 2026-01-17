import React from 'react';
import styles from './Dashboard.module.css';
import { getDashboardStats, getTransactions } from '@/lib/actions';
import TransactionList from './TransactionList';
import Importer from './Importer';

export default async function Dashboard() {
    const stats = await getDashboardStats();
    const transactions = await getTransactions();

    return (
        <div className="container">
            <header className={styles.header}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.logoText}>Make Money With AI</h1>
                </div>
                <nav className={styles.nav}>
                    <a href="#" className={styles.navLink}>Dashboard</a>
                    <a href="#" className={styles.navLink}>Transactions</a>
                    <a href="#" className={styles.navLink}>Reports</a>
                </nav>
            </header>

            <div className={styles.grid}>
                <div className="card">
                    <h3>Net Income</h3>
                    <p className={`${styles.amount} ${Number(stats.netIncome) >= 0 ? styles.positive : styles.negative}`}>
                        CHF {stats.netIncome}
                    </p>
                </div>
                <div className="card">
                    <h3>Total Spending</h3>
                    <p className={styles.amount}>CHF {stats.totalSpending}</p>
                </div>
                <div className="card">
                    <h3>Subscriptions</h3>
                    <p className={styles.amount}>CHF {stats.subscriptions}</p>
                </div>
            </div>

            <div className={styles.section}>
                <TransactionList transactions={transactions} />
            </div>
        </div>
    );
}
