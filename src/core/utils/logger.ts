export const logger = {
  info: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.info('[PagoJusto]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error('[PagoJusto]', ...args);
    }
  },
};
