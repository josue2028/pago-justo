import type { PropsWithChildren } from 'react';

export function ThemeProvider({ children }: PropsWithChildren): JSX.Element {
  return <div className="min-h-screen bg-brand-background text-brand-text">{children}</div>;
}
