// lib/getCurrencySymbol.ts

export function getCurrencySymbol(currencyCode: string): string {
    try {
        // Format a number using the currency code
        const formatted = (100).toLocaleString('en', {
            style: 'currency',
            currency: currencyCode,
            currencyDisplay: 'narrowSymbol', // gives just the symbol
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        // Remove numbers and whitespace, keep the symbol
        return formatted.replace(/[\d\s.,]/g, '').trim();
    } catch {
        // Fallback: return the currency code if symbol is not available
        return currencyCode;
    }
}
