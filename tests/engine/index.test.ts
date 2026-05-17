import { describe, expect, it } from 'vitest';
import {
  calculateAll,
  calculateFinalSettlement,
  calculateSalaryIncrease,
  compareScenarios,
} from '@/core/engine/calculators';
import { calculateContractorIbc } from '@/core/engine/calculators/contractor';
import type { CalculatorInput } from '@/core/engine/types/calculator.types';

const employeeInput: CalculatorInput = {
  role: 'EMPLEADO_DEPENDIENTE',
  contractType: 'TERMINO_INDEFINIDO',
  baseSalary: 2000000,
  startDate: new Date('2026-03-01T00:00:00.000Z'),
  endDate: new Date('2026-03-31T00:00:00.000Z'),
  arlRisk: 'RIESGO_I',
  includesTransportAllowance: false,
  employeeAge: 30,
  employerPersonType: 'JURIDICA',
};

describe('engine index helpers', () => {
  it('compareScenarios calcula diferencias entre escenarios', () => {
    const comparison = compareScenarios(employeeInput, {
      ...employeeInput,
      baseSalary: 2500000,
    });

    expect(comparison.deltas.employerCost).toBeGreaterThan(0);
    expect(comparison.deltas.employeeNet).toBeGreaterThan(0);
  });

  it('calculateSalaryIncrease proyecta un aumento salarial', () => {
    const result = calculateSalaryIncrease(employeeInput, 10);
    expect(result.projected.summary.employerCost).toBeGreaterThan(result.current.summary.employerCost);
  });

  it('calculateFinalSettlement aplica indemnizacion para despido sin justa causa', () => {
    const settlement = calculateFinalSettlement({
      contractType: 'TERMINO_INDEFINIDO',
      baseSalary: 2000000,
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2026-06-30T00:00:00.000Z'),
      cause: 'DESPIDO_SIN_JUSTA_CAUSA',
      includesTransportAllowance: false,
      pendingWorkedDays: 15,
    });

    expect(settlement.indemnizacion).toBe(2000000);
    expect(settlement.totalSettlement).toBeGreaterThan(settlement.indemnizacion);
  });

  it('calculateFinalSettlement cubre termino fijo y obra labor', () => {
    const fixedSettlement = calculateFinalSettlement({
      contractType: 'TERMINO_FIJO',
      baseSalary: 2000000,
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2026-06-15T00:00:00.000Z'),
      scheduledContractEndDate: new Date('2026-07-15T00:00:00.000Z'),
      cause: 'DESPIDO_SIN_JUSTA_CAUSA',
      includesTransportAllowance: false,
      pendingWorkedDays: 10,
    });
    const obraSettlement = calculateFinalSettlement({
      contractType: 'OBRA_LABOR',
      baseSalary: 2000000,
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2026-06-15T00:00:00.000Z'),
      estimatedRemainingDays: 25,
      cause: 'DESPIDO_SIN_JUSTA_CAUSA',
      includesTransportAllowance: false,
      pendingWorkedDays: 10,
    });

    expect(fixedSettlement.indemnizacion).toBeGreaterThan(0);
    expect(obraSettlement.indemnizacion).toBeGreaterThan(0);
  });

  it('calculateContractorIbc aplica el 40% con tope minimo', () => {
    expect(calculateContractorIbc({ grossIncome: 4000000 }, 1)).toBe(1750905);
    expect(calculateContractorIbc({ grossIncome: 1000000 }, 1)).toBe(1750905);
  });

  it('calculateAll incorpora referencias legales y metadata', () => {
    const result = calculateAll(employeeInput);
    expect(result.legalReferences).toHaveLength(6);
    expect(result.metadata.ratesYear).toBe(2026);
  });

  it('valida salario minimo y gross income obligatorio', () => {
    expect(() =>
      calculateAll({
        ...employeeInput,
        baseSalary: 1000000,
      }),
    ).toThrow();

    expect(() =>
      calculateAll({
        ...employeeInput,
        role: 'CONTRATISTA_INDEPENDIENTE',
        grossIncome: undefined,
      }),
    ).toThrow();
  });

  it('mantiene prestaciones y parafiscales en cero para prestacion de servicios', () => {
    const result = calculateAll({
      ...employeeInput,
      role: 'CONTRATISTA_INDEPENDIENTE',
      grossIncome: 3000000,
    });

    expect(result.benefits?.prima).toBe(0);
    expect(result.benefits?.vacaciones).toBe(0);
    expect(result.parafiscales?.cajaCompensacion).toBe(0);
    expect(result.parafiscales?.icbf).toBe(0);
    expect(result.parafiscales?.sena).toBe(0);
  });
});
