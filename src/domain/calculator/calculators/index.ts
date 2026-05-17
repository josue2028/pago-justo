import { LEGAL_REFERENCES, CURRENT_LEGAL_RATES } from '../constants/colombiaRates';
import { differenceInCalendarDays } from 'date-fns';
import { calculateBenefits } from './benefits';
import { calculateParafiscales } from './parafiscales';
import { calculateSocialSecurity } from './socialSecurity';
import {
  getPeriodMetrics,
  validateCalculatorInput,
  calculateTransportAllowance,
} from '../validators/laboralRules';
import type {
  CalculatorInput,
  CalculatorResult,
  FinalSettlementInput,
  FinalSettlementResult,
  SalaryIncreaseResult,
  ScenarioComparison,
} from '../types/calculator.types';

export function calculateAll(input: CalculatorInput): CalculatorResult {
  const errors = validateCalculatorInput(input);
  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  const { workingDays, periodRatio } = getPeriodMetrics(input.startDate, input.endDate);
  const salaryBase = input.role === 'CONTRATISTA_INDEPENDIENTE' ? input.grossIncome ?? 0 : input.baseSalary;
  const grossSalaryPeriod = Math.round(salaryBase * periodRatio);
  const transportAllowancePeriod = Math.round(
    calculateTransportAllowance(input.baseSalary, input.includesTransportAllowance) * periodRatio,
  );
  const socialSecurity = calculateSocialSecurity(input, periodRatio);
  const parafiscales = calculateParafiscales(input, grossSalaryPeriod);
  const benefits = calculateBenefits(input, workingDays);

  const employerSocial =
    socialSecurity.saludEmpleador + socialSecurity.pensionEmpleador + socialSecurity.arlEmpleador;
  const employeeSocial = socialSecurity.saludEmpleado + socialSecurity.pensionEmpleado;
  const contractorSocial =
    socialSecurity.saludEmpleado + socialSecurity.pensionEmpleado + socialSecurity.arlContratista;
  const totalParafiscales =
    (parafiscales?.cajaCompensacion ?? 0) + (parafiscales?.icbf ?? 0) + (parafiscales?.sena ?? 0);
  const totalBenefits =
    (benefits?.prima ?? 0) +
    (benefits?.cesantias ?? 0) +
    (benefits?.interesesCesantias ?? 0) +
    (benefits?.vacaciones ?? 0);

  return {
    socialSecurity,
    parafiscales,
    benefits,
    summary: {
      grossSalaryPeriod,
      transportAllowancePeriod,
      employerCost:
        input.role === 'CONTRATISTA_INDEPENDIENTE'
          ? grossSalaryPeriod + socialSecurity.arlEmpleador
          : grossSalaryPeriod + transportAllowancePeriod + employerSocial + totalParafiscales + totalBenefits,
      employeeNet:
        input.role === 'CONTRATISTA_INDEPENDIENTE'
          ? grossSalaryPeriod - contractorSocial
          : grossSalaryPeriod + transportAllowancePeriod - employeeSocial,
      totalSocialSecurity: employerSocial + employeeSocial + socialSecurity.arlContratista,
      totalBenefits,
      totalParafiscales,
    },
    legalReferences: [...LEGAL_REFERENCES],
    metadata: {
      ratesYear: CURRENT_LEGAL_RATES.EFFECTIVE_YEAR,
      smmlv: CURRENT_LEGAL_RATES.SMMLV,
      calculatedAt: new Date(),
      workingDays,
      periodRatio,
    },
  };
}

export function compareScenarios(base: CalculatorInput, target: CalculatorInput): ScenarioComparison {
  const baseResult = calculateAll(base);
  const targetResult = calculateAll(target);

  return {
    base: baseResult,
    target: targetResult,
    deltas: {
      employerCost: targetResult.summary.employerCost - baseResult.summary.employerCost,
      employeeNet: targetResult.summary.employeeNet - baseResult.summary.employeeNet,
      socialSecurity: targetResult.summary.totalSocialSecurity - baseResult.summary.totalSocialSecurity,
      benefits: targetResult.summary.totalBenefits - baseResult.summary.totalBenefits,
    },
  };
}

export function calculateSalaryIncrease(input: CalculatorInput, increasePercentage: number): SalaryIncreaseResult {
  const current = calculateAll(input);
  const projected = calculateAll({
    ...input,
    baseSalary: Math.round(input.baseSalary * (1 + increasePercentage / 100)),
  });

  return {
    current,
    projected,
    increasePercentage,
  };
}

export function calculateFinalSettlement(input: FinalSettlementInput): FinalSettlementResult {
  const calculatorInput: CalculatorInput = {
    role: 'EMPLEADO_DEPENDIENTE',
    contractType: input.contractType,
    baseSalary: input.baseSalary,
    startDate: input.startDate,
    endDate: input.endDate,
    arlRisk: 'RIESGO_I',
    includesTransportAllowance: input.includesTransportAllowance,
  };

  const benefits = calculateBenefits(
    calculatorInput,
    getPeriodMetrics(input.startDate, input.endDate).workingDays,
  );

  if (!benefits) {
    throw new Error('La liquidación final solo aplica para contratos laborales.');
  }

  const indemnizacion =
    input.cause === 'DESPIDO_SIN_JUSTA_CAUSA' ? calculateIndemnization(input) : 0;

  const salaryPending = Math.round((input.baseSalary / 30) * (input.pendingWorkedDays ?? 0));
  const transportAllowancePending = Math.round(
    (calculateTransportAllowance(input.baseSalary, input.includesTransportAllowance) / 30) *
      (input.pendingWorkedDays ?? 0),
  );

  return {
    benefits,
    salaryPending,
    transportAllowancePending,
    indemnizacion,
    totalSettlement:
      benefits.prima +
      benefits.cesantias +
      benefits.interesesCesantias +
      benefits.vacaciones +
      indemnizacion +
      salaryPending +
      transportAllowancePending,
  };
}

export { calculateBenefits, calculateParafiscales, calculateSocialSecurity };

function calculateIndemnization(input: FinalSettlementInput): number {
  const daysWorked = Math.max(differenceInCalendarDays(input.endDate, input.startDate) + 1, 1);
  const yearsWorked = daysWorked / 360;
  const dailySalary = input.baseSalary / 30;

  if (input.contractType === 'TERMINO_INDEFINIDO' || input.contractType === 'MEDIO_TIEMPO') {
    const firstYearDays =
      input.baseSalary < CURRENT_LEGAL_RATES.SMMLV * 10 ? 30 : 20;
    const additionalYearDays =
      input.baseSalary < CURRENT_LEGAL_RATES.SMMLV * 10 ? 20 : 15;
    const indemnityDays =
      yearsWorked <= 1
        ? firstYearDays
        : firstYearDays + (yearsWorked - 1) * additionalYearDays;

    return Math.round(dailySalary * indemnityDays);
  }

  if (input.contractType === 'TERMINO_FIJO' && input.scheduledContractEndDate) {
    const remainingDays = Math.max(
      differenceInCalendarDays(input.scheduledContractEndDate, input.endDate),
      15,
    );
    return Math.round(dailySalary * remainingDays);
  }

  if (input.contractType === 'OBRA_LABOR') {
    return Math.round(dailySalary * Math.max(input.estimatedRemainingDays ?? 15, 15));
  }

  return Math.round(dailySalary * 15);
}
