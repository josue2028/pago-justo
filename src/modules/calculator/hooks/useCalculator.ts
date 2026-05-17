import { useMemo } from 'react';
import { calculateAll } from '@core/engine/calculators';
import type { CalculatorInput, CalculatorResult } from '@core/engine/types/calculator.types';

export function useCalculator(input: CalculatorInput | null): {
  result: CalculatorResult | null;
  isValid: boolean;
} {
  return useMemo(() => {
    if (!input) {
      return { result: null, isValid: false };
    }

    try {
      return {
        result: calculateAll(input),
        isValid: true,
      };
    } catch {
      return {
        result: null,
        isValid: false,
      };
    }
  }, [input]);
}
