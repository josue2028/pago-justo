import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

export function ToastProvider({ children }: PropsWithChildren): JSX.Element {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
      />
    </>
  );
}
