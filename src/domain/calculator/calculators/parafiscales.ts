import { CURRENT_LEGAL_RATES } from '../constants/colombiaRates';
import type { CalculatorInput, ParafiscalesResult } from '../types/calculator.types';

const roundCurrency = (value: number) => Math.round(value);

function isExemptFromSenaAndIcbf(input: CalculatorInput, payrollBase: number): boolean {
  return (
    input.role === 'EMPLEADO_DEPENDIENTE' &&
    input.baseSalary < CURRENT_LEGAL_RATES.SMMLV * 10 &&
    payrollBase < CURRENT_LEGAL_RATES.SMMLV * 10
  );
}

export function calculateParafiscales(
  input: CalculatorInput,
  payrollBase: number,
): ParafiscalesResult | null {
  if (input.role === 'CONTRATISTA_INDEPENDIENTE') {
    return {
      cajaCompensacion: 0,
      icbf: 0,
      sena: 0,
      payrollBase: 0,
      exempted: false,
    };
  }

  const exempted = isExemptFromSenaAndIcbf(input, payrollBase);
  return {
    cajaCompensacion: roundCurrency(payrollBase * CURRENT_LEGAL_RATES.CAJA_COMPENSACION),
    icbf: exempted ? 0 : roundCurrency(payrollBase * CURRENT_LEGAL_RATES.ICBF),
    sena: exempted ? 0 : roundCurrency(payrollBase * CURRENT_LEGAL_RATES.SENA),
    payrollBase: roundCurrency(payrollBase),
    exempted,
  };
}
