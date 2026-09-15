export const CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY || 'LKR ';

export function formatPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  return `LKR ${num.toLocaleString('en-LK')}`;
}
