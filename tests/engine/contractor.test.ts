import { describe, expect, it } from 'vitest';
import { calculateAll } from '@/core/engine/calculators';
import type { CalculatorInput } from '@/core/engine/types/calculator.types';

describe('contractor flow', () => {
  it('usa ibc del 40% y no genera prestaciones ni parafiscales', () => {
    const input: CalculatorInput = {
      role: 'CONTRATISTA_INDEPENDIENTE',
      baseSalary: 1750905,
      grossIncome: 4000000,
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T00:00:00.000Z'),
      arlRisk: 'RIESGO_II',
      includesTransportAllowance: false,
    };

    const result = calculateAll(input);
    expect(result.socialSecurity.ibc).toBe(1750905);
    expect(result.parafiscales?.cajaCompensacion).toBe(0);
    expect(result.parafiscales?.icbf).toBe(0);
    expect(result.parafiscales?.sena).toBe(0);
    expect(result.benefits?.prima).toBe(0);
    expect(result.benefits?.vacaciones).toBe(0);
    expect(result.summary.employeeNet).toBeLessThan(result.summary.grossSalaryPeriod);
  });

  it('suma arl al costo del contratante en riesgo alto', () => {
    const input: CalculatorInput = {
      role: 'CONTRATISTA_INDEPENDIENTE',
      baseSalary: 1750905,
      grossIncome: 6000000,
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T00:00:00.000Z'),
      arlRisk: 'RIESGO_V',
      includesTransportAllowance: false,
    };

    const result = calculateAll(input);
    expect(result.socialSecurity.arlEmpleador).toBeGreaterThan(0);
    expect(result.summary.employerCost).toBeGreaterThan(result.summary.grossSalaryPeriod);
  });
});
