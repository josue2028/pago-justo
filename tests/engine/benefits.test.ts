import { describe, expect, it } from 'vitest';
import { calculateBenefits } from '@/core/engine/calculators/benefits';
import type { CalculatorInput } from '@/core/engine/types/calculator.types';

const input: CalculatorInput = {
  role: 'EMPLEADO_DEPENDIENTE',
  contractType: 'TERMINO_FIJO',
  baseSalary: 1750905,
  startDate: new Date('2026-03-01T00:00:00.000Z'),
  endDate: new Date('2026-03-31T00:00:00.000Z'),
  arlRisk: 'RIESGO_I',
  includesTransportAllowance: true,
};

describe('calculateBenefits', () => {
  it('incluye auxilio en prima y cesantias', () => {
    const result = calculateBenefits(input, 30);
    expect(result?.baseWithAllowance).toBe(2000000);
    expect(result?.prima).toBeGreaterThan(160000);
    expect(result?.vacaciones).toBeLessThan(result?.prima ?? 0);
  });

  it('calcula proporcionalmente un periodo parcial', () => {
    const result = calculateBenefits(input, 15);
    expect(result?.prima).toBe(83333);
    expect(result?.vacaciones).toBeLessThan(60000);
  });
});
