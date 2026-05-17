import { describe, expect, it } from 'vitest';
import { calculateSocialSecurity } from '@/core/engine/calculators/socialSecurity';
import type { CalculatorInput } from '@/core/engine/types/calculator.types';

const baseInput: CalculatorInput = {
  role: 'EMPLEADO_DEPENDIENTE',
  contractType: 'TERMINO_INDEFINIDO',
  baseSalary: 2000000,
  startDate: new Date('2026-03-01T00:00:00.000Z'),
  endDate: new Date('2026-03-31T00:00:00.000Z'),
  arlRisk: 'RIESGO_I',
  includesTransportAllowance: false,
  employerPersonType: 'JURIDICA',
};

describe('calculateSocialSecurity', () => {
  it('calcula salud y pension correctamente para empleado', () => {
    const result = calculateSocialSecurity(baseInput, 1);
    expect(result.saludEmpleado).toBe(80000);
    expect(result.pensionEmpleado).toBe(80000);
    expect(result.pensionEmpleadoRate).toBe(0.04);
    expect(result.saludEmpleador).toBe(0);
    expect(result.pensionEmpleador).toBe(240000);
    expect(result.arlEmpleador).toBeGreaterThan(0);
  });

  it('aplica fondo de solidaridad pensional desde 4 smmlv', () => {
    const result = calculateSocialSecurity(
      {
        ...baseInput,
        baseSalary: 4 * 1750905,
      },
      1,
    );

    expect(result.pensionEmpleadoRate).toBe(0.05);
    expect(result.pensionEmpleado).toBe(350181);
    expect(result.pensionEmpleador).toBe(840434);
  });

  it('aplica la tarifa maxima del fondo de solidaridad desde 20 smmlv', () => {
    const result = calculateSocialSecurity(
      {
        ...baseInput,
        baseSalary: 20 * 1750905,
      },
      1,
    );

    expect(result.pensionEmpleadoRate).toBe(0.06);
    expect(result.pensionEmpleado).toBe(2101086);
    expect(result.pensionEmpleador).toBe(4202172);
  });

  it('cobra salud al empleador cuando supera 10 smmlv', () => {
    const result = calculateSocialSecurity(
      {
        ...baseInput,
        baseSalary: 18000000,
      },
      1,
    );

    expect(result.saludEmpleador).toBeGreaterThan(0);
  });

  it('respeta ibc minimo de medio tiempo', () => {
    const result = calculateSocialSecurity(
      {
        ...baseInput,
        contractType: 'MEDIO_TIEMPO',
        baseSalary: 500000,
      },
      1,
    );

    expect(result.ibc).toBe(875453);
  });

  it('asigna la arl al contratista en riesgo i a iii', () => {
    const result = calculateSocialSecurity(
      {
        ...baseInput,
        role: 'CONTRATISTA_INDEPENDIENTE',
        grossIncome: 4000000,
      },
      1,
    );

    expect(result.saludEmpleador).toBe(0);
    expect(result.pensionEmpleador).toBe(0);
    expect(result.saludEmpleado).toBe(218863);
    expect(result.pensionEmpleado).toBe(280145);
    expect(result.pensionEmpleadoRate).toBe(0.16);
    expect(result.arlContratista).toBeGreaterThan(0);
    expect(result.arlEmpleador).toBe(0);
  });

  it('asigna la arl al contratante en riesgo iv y v', () => {
    const result = calculateSocialSecurity(
      {
        ...baseInput,
        role: 'CONTRATISTA_INDEPENDIENTE',
        grossIncome: 5000000,
        arlRisk: 'RIESGO_IV',
      },
      1,
    );

    expect(result.arlEmpleador).toBeGreaterThan(0);
    expect(result.arlContratista).toBe(0);
  });
});
