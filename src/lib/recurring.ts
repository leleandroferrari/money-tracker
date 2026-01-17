import db from './db';

// Simple heuristic: if we have seen this description with this amount before, mark as recurring?
// Or just hardcode common recurring services as per request.

export async function checkRecurring(description: string, amount: number): Promise<boolean> {
    if (amount >= 0) return false; // Income is not an "expense" subscription generally

    const desc = description.toLowerCase();

    // Known recurring services from user prompt + common ones
    const subscriptionKeywords = [
        'adobe',
        'subs',
        'plan',
        'recurring',
        'insurance',
        'rent',
        'phone',
        'spotify',
        'netflix',
        'github',
        'notion',
        'hosting',
        'workspace'
    ];

    if (subscriptionKeywords.some(keyword => desc.includes(keyword))) {
        return true;
    }

    return false;
}
