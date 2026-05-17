import { describe, expect, it } from 'vitest';
import { calculateParafiscales } from '@domain/calculator/calculators/parafiscales';
import type { CalculatorInput } from '@domain/calculator/types/calculator.types';

const employeeInput: CalculatorInput = {
  role: 'EMPLEADO_DEPENDIENTE',
  contractType: 'TERMINO_INDEFINIDO',
  baseSalary: 1800000,
  startDate: new Date('2026-03-01T00:00:00.000Z'),
  endDate: new Date('2026-03-31T00:00:00.000Z'),
  arlRisk: 'RIESGO_I',
  includesTransportAllowance: false,
  employerPersonType: 'JURIDICA',
  employeeAge: 24,
  isNewHireForYouthExemption: true,
};

describe('calculateParafiscales', () => {
  it('exime sena e icbf por ley 1607 para persona juridica con salario bajo', () => {
    const result = calculateParafiscales(employeeInput, 1800000);
    expect(result?.cajaCompensacion).toBe(72000);
    expect(result?.icbf).toBe(0);
    expect(result?.sena).toBe(0);
  });

  it('tambien exime a persona natural cuando el salario es inferior a 10 smmlv', () => {
    const result = calculateParafiscales(
      {
        ...employeeInput,
        employerPersonType: 'NATURAL',
      },
      1800000,
    );

    expect(result?.icbf).toBe(0);
    expect(result?.sena).toBe(0);
  });

  it('no aplica para independientes', () => {
    const result = calculateParafiscales(
      {
        ...employeeInput,
        role: 'CONTRATISTA_INDEPENDIENTE',
      },
      1800000,
    );

    expect(result).toEqual({
      cajaCompensacion: 0,
      icbf: 0,
      sena: 0,
      payrollBase: 0,
      exempted: false,
    });
  });
});
