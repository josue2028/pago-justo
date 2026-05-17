import { create } from 'zustand';
import { calculateAll } from '@core/engine/calculators';
import type { CalculatorInput, CalculatorResult } from '@core/engine/types/calculator.types';

interface CalculatorStore {
  currentStep: number;
  input: Partial<CalculatorInput>;
  result: CalculatorResult | null;
  setStep: (step: number) => void;
  updateInput: (partial: Partial<CalculatorInput>) => void;
  calculate: () => void;
  reset: () => void;
}

const initialInput: Partial<CalculatorInput> = {
  role: 'EMPLEADO_DEPENDIENTE',
  contractType: 'TERMINO_INDEFINIDO',
  baseSalary: 1750905,
  startDate: new Date('2026-03-01T00:00:00.000Z'),
  endDate: new Date(),
  arlRisk: 'RIESGO_I',
  includesTransportAllowance: true,
  companySize: 'SMALL',
  employerPersonType: 'JURIDICA',
  employeeAge: 27,
  isNewHireForYouthExemption: false,
};

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  currentStep: 1,
  input: initialInput,
  result: null,
  setStep: (step) => set({ currentStep: step }),
  updateInput: (partial) => set((state) => ({ input: { ...state.input, ...partial } })),
  calculate: () => {
    const input = get().input as CalculatorInput;
    set({ result: calculateAll(input) });
  },
  reset: () =>
    set({
      currentStep: 1,
      input: initialInput,
      result: null,
    }),
}));
