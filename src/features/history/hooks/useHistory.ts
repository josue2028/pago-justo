import { useEffect, useState } from 'react';
import type { CalculatorInput, CalculatorResult } from '@core/engine/types/calculator.types';

export interface HistoryEntry {
  id: string;
  createdAt: string;
  input: CalculatorInput;
  result: CalculatorResult;
}

const STORAGE_KEY = 'pago-justo-history';

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setEntries(JSON.parse(raw) as HistoryEntry[]);
    }
  }, []);

  const persist = (nextEntries: HistoryEntry[]) => {
    setEntries(nextEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries.slice(0, 20)));
  };

  return {
    entries,
    save: (input: CalculatorInput, result: CalculatorResult) => {
      persist([
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          input,
          result,
        },
        ...entries,
      ]);
    },
    remove: (id: string) => persist(entries.filter((entry) => entry.id !== id)),
    clear: () => persist([]),
  };
}
