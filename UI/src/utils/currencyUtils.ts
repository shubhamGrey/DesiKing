/**
 * Utility functions for currency handling
 */

/**
 * Converts currency code to its corresponding symbol
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR', 'INR')
 * @returns The currency symbol (e.g., '$', '€', '₹') or the original code if not found
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CNY: "¥",
    KRW: "₩",
    RUB: "₽",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    CZK: "Kč",
    HUF: "Ft",
    BGN: "лв",
    RON: "lei",
    TRY: "₺",
    BRL: "R$",
    MXN: "$",
    ZAR: "R",
    THB: "฿",
    SGD: "S$",
    MYR: "RM",
    IDR: "Rp",
    PHP: "₱",
    VND: "₫",
  };
  
  return currencySymbols[currencyCode] || currencyCode;
};

/**
 * Formats a price with currency symbol
 * @param amount - The amount to format
 * @param currencyCode - The currency code
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string with currency symbol
 */
export const formatPrice = (
  amount: number,
  currencyCode: string,
  decimals: number = 2
): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toFixed(decimals)}`;
};
