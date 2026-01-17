'use client';

import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/lib/actions';
import { Download } from 'lucide-react';

export default function PDFReport({ transactions }: { transactions: Transaction[] }) {

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('Finance Report', 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Calculate totals
        const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
        const net = income + expenses;

        doc.text(`Total Income: CHF ${income.toFixed(2)}`, 14, 40);
        doc.text(`Total Expenses: CHF ${Math.abs(expenses).toFixed(2)}`, 14, 46);
        doc.text(`Net Income: CHF ${net.toFixed(2)}`, 14, 52);

        // Table
        const tableData = transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.description,
            t.category,
            `CHF ${t.amount.toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 60,
            head: [['Date', 'Description', 'Category', 'Amount']],
            body: tableData,
        });

        doc.save('finance-report.pdf');
    };

    return (
        <button onClick={generatePDF} className="btn btn-primary" style={{ marginLeft: '1rem', background: '#2E2E2E' }}>
            <Download size={16} style={{ marginRight: '8px' }} />
            Export PDF
        </button>
    );
}
