# Finance Tracker

A modern finance tracking application built with Next.js, featuring dark mode and an AI-powered chatbot assistant.

## Features

- 📊 **Dashboard Overview**: Track total income, net savings, spending, and subscriptions
- 💰 **Transaction Management**: Add, edit, and delete transactions with automatic categorization
- 🔄 **CSV Import**: Bulk import transactions from CSV files
- 🤖 **AI Chatbot**: Ask questions about your finances and get instant insights
- 📱 **Dark Mode**: Beautiful dark theme for comfortable viewing
- 📄 **PDF Export**: Generate detailed financial reports
- 🏷️ **Auto-Categorization**: Automatically categorize transactions based on description
- 🔁 **Recurring Detection**: Identify and track recurring expenses

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Charts**: Chart.js
- **PDF Generation**: jsPDF
- **CSV Parsing**: PapaParse
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/leleandroferrari/money-tracker.git
cd money-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Importing Transactions

1. Prepare a CSV file with columns: `Date`, `Description`, `Amount`
2. Drag and drop the CSV file into the import area
3. Transactions will be automatically categorized and added

### Using the AI Chatbot

- Click the chat icon in the bottom right
- Ask questions like:
  - "What's my total spending?"
  - "How much did I spend on food?"
  - "What are my subscriptions?"
  - "What's my biggest expense?"

### Exporting Reports

- Click the "Export PDF" button to generate a comprehensive financial report
- The PDF includes all transactions and summary statistics

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Global styles and CSS variables
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── Chatbot.tsx       # AI chatbot component
│   ├── Dashboard.tsx     # Main dashboard
│   ├── Importer.tsx      # CSV import component
│   ├── PDFReport.tsx     # PDF export component
│   └── TransactionList.tsx # Transaction table
└── lib/
    ├── actions.ts        # Server actions for CRUD operations
    ├── categorization.ts # Auto-categorization logic
    ├── chat.ts           # AI chatbot logic
    ├── db.ts             # Database setup
    ├── mockData.ts       # Sample data
    └── recurring.ts      # Recurring transaction detection
```

## License

MIT

## Author

Leandro Ferrari
