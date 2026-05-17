export function parseCurrencyInput(value: string): number {
  return Number(value.replace(/[^\d]/g, '')) || 0;
}

export function toBase64Url(value: string): string {
  return btoa(unescape(encodeURIComponent(value)));
}

export function fromBase64Url(value: string): string {
  return decodeURIComponent(escape(atob(value)));
}
