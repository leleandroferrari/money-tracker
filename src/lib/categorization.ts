export async function categorizeTransaction(description: string, amount: number): Promise<string> {
    const desc = description.toLowerCase();

    if (amount > 0) return 'Income';

    if (desc.includes('adobe') || desc.includes('software') || desc.includes('github') || desc.includes('notion')) {
        return 'Software';
    }
    if (desc.includes('rent') || desc.includes('office')) {
        return 'Office';
    }
    if (desc.includes('phone') || desc.includes('mobile') || desc.includes('internet')) {
        return 'Utilities';
    }
    if (desc.includes('insur') || desc.includes('health')) {
        return 'Insurance';
    }
    if (desc.includes('cloud') || desc.includes('aws') || desc.includes('azure') || desc.includes('hosting')) {
        return 'Hosting';
    }
    if (desc.includes('food') || desc.includes('lunch') || desc.includes('restaurant')) {
        return 'Meals';
    }
    if (desc.includes('transport') || desc.includes('uber') || desc.includes('train') || desc.includes('sbb')) {
        return 'Transport';
    }
    if (desc.includes('ads') || desc.includes('marketing') || desc.includes('google')) {
        return 'Marketing';
    }

    return 'Uncategorized';
}
