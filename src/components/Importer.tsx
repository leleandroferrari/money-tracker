'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { addTransaction } from '@/lib/actions';
import { Upload } from 'lucide-react';
import styles from './Importer.module.css';

export default function Importer() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<string>('');

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        setUploading(true);
        setStatus('Parsing CSV...');

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                setStatus(`Importing ${results.data.length} transactions...`);
                let imported = 0;

                for (const row of results.data as any[]) {
                    // Assume columns: Date, Description, Amount
                    // Adjust logic to map CSV columns to fields
                    const date = row['Date'] || new Date().toISOString().slice(0, 10);
                    const description = row['Description'] || row['Memo'] || 'Unknown';
                    const amount = parseFloat(row['Amount']);

                    if (description && !isNaN(amount)) {
                        const formData = new FormData();
                        formData.append('date', date);
                        formData.append('description', description);
                        formData.append('amount', amount.toString());

                        try {
                            await addTransaction(formData);
                            imported++;
                        } catch (err) {
                            console.error('Failed to import row', row);
                        }
                    }
                }
                setUploading(false);
                setStatus(`Successfully imported ${imported} transactions!`);
                setTimeout(() => setStatus(''), 3000);
            },
            error: (err) => {
                setUploading(false);
                setStatus('Error parsing CSV');
                console.error(err);
            }
        });
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Import Transactions</h3>

            <div
                className={`${styles.dropzone} ${isDragOver ? styles.dragover : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload size={32} className={styles.icon} />
                <p>Drag & drop a CSV file here, or click to select</p>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            </div>

            {status && <p className={styles.status}>{status}</p>}
        </div>
    );
}
