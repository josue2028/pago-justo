import { describe, expect, it } from 'vitest';
import { calculateAll } from '@/core/engine/calculators';
import { CURRENT_LEGAL_RATES } from '@/core/engine/constants/colombiaRates';
import type { CalculatorInput } from '@/core/engine/types/calculator.types';

describe('edge cases', () => {
  it('mantiene auxilio exactamente en 2 smmlv', () => {
    const input: CalculatorInput = {
      role: 'EMPLEADO_DEPENDIENTE',
      contractType: 'TERMINO_INDEFINIDO',
      baseSalary: CURRENT_LEGAL_RATES.SMMLV * 2,
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T00:00:00.000Z'),
      arlRisk: 'RIESGO_I',
      includesTransportAllowance: true,
    };

    expect(calculateAll(input).summary.transportAllowancePeriod).toBe(CURRENT_LEGAL_RATES.AUXILIO_TRANSPORTE);
  });

  it('lanza error cuando las fechas son invalidas', () => {
    const input: CalculatorInput = {
      role: 'EMPLEADO_DEPENDIENTE',
      contractType: 'TERMINO_INDEFINIDO',
      baseSalary: CURRENT_LEGAL_RATES.SMMLV,
      startDate: new Date('2026-04-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T00:00:00.000Z'),
      arlRisk: 'RIESGO_I',
      includesTransportAllowance: true,
    };

    expect(() => calculateAll(input)).toThrow();
  });
});
