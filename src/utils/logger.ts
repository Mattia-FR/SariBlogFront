// Journalisation console réservée au développement : rien ne sort dans les DevTools en production.
export const logger = {
  debug(...args: unknown[]): void {
    if (import.meta.env.DEV) console.log(...args);
  },
  error(...args: unknown[]): void {
    if (import.meta.env.DEV) console.error(...args);
  },
};
