import { CURRENT_LEGAL_RATES } from '../constants/colombiaRates';
import { clampIbc, getMinimumIbc } from '../validators/laboralRules';
import type { ArlRisk, CalculatorInput, SocialSecurityResult } from '../types/calculator.types';

const ARL_RATE_MAP: Record<ArlRisk, number> = {
  RIESGO_I: CURRENT_LEGAL_RATES.ARL_RIESGO_I,
  RIESGO_II: CURRENT_LEGAL_RATES.ARL_RIESGO_II,
  RIESGO_III: CURRENT_LEGAL_RATES.ARL_RIESGO_III,
  RIESGO_IV: CURRENT_LEGAL_RATES.ARL_RIESGO_IV,
  RIESGO_V: CURRENT_LEGAL_RATES.ARL_RIESGO_V,
};

const roundCurrency = (value: number) => Math.round(value);

function isLaw1607Exempt(input: CalculatorInput): boolean {
  return input.role === 'EMPLEADO_DEPENDIENTE' && input.baseSalary < CURRENT_LEGAL_RATES.SMMLV * 10;
}

function getEmployeePensionRate(baseSalary: number): number {
  const salaryInSmmlv = baseSalary / CURRENT_LEGAL_RATES.SMMLV;

  if (salaryInSmmlv < 4) {
    return CURRENT_LEGAL_RATES.PENSION_EMPLEADO;
  }

  if (salaryInSmmlv < 16) {
    return 0.05;
  }

  if (salaryInSmmlv < 17) {
    return 0.052;
  }

  if (salaryInSmmlv < 18) {
    return 0.054;
  }

  if (salaryInSmmlv < 19) {
    return 0.056;
  }

  if (salaryInSmmlv < 20) {
    return 0.058;
  }

  return 0.06;
}

export function calculateSocialSecurity(input: CalculatorInput, periodRatio: number): SocialSecurityResult {
  if (input.role === 'CONTRATISTA_INDEPENDIENTE') {
    const minimumIbc = getMinimumIbc(input) * periodRatio;
    const contractorBase =
      (input.grossIncome ?? 0) * CURRENT_LEGAL_RATES.IBC_INDEPENDIENTE_PORCENTAJE * periodRatio;
    const ibc = clampIbc(contractorBase, minimumIbc);
    const arlValue = roundCurrency(ibc * ARL_RATE_MAP[input.arlRisk]);
    const companyAssumesArl = input.arlRisk === 'RIESGO_IV' || input.arlRisk === 'RIESGO_V';

    return {
      saludEmpleador: 0,
      saludEmpleado: roundCurrency(ibc * (CURRENT_LEGAL_RATES.SALUD_EMPLEADOR + CURRENT_LEGAL_RATES.SALUD_EMPLEADO)),
      pensionEmpleador: 0,
      pensionEmpleado: roundCurrency(
        ibc * (CURRENT_LEGAL_RATES.PENSION_EMPLEADOR + CURRENT_LEGAL_RATES.PENSION_EMPLEADO),
      ),
      pensionEmpleadoRate: CURRENT_LEGAL_RATES.PENSION_EMPLEADOR + CURRENT_LEGAL_RATES.PENSION_EMPLEADO,
      arlEmpleador: companyAssumesArl ? arlValue : 0,
      arlContratista: companyAssumesArl ? 0 : arlValue,
      arlTotal: arlValue,
      ibc: roundCurrency(ibc),
    };
  }

  const minimumIbc = getMinimumIbc(input) * periodRatio;
  const rawIbc = input.baseSalary * periodRatio;
  const ibc = clampIbc(rawIbc, minimumIbc);
  const exempt = isLaw1607Exempt(input);
  const pensionEmpleadoRate = getEmployeePensionRate(input.baseSalary);

  return {
    saludEmpleador: exempt ? 0 : roundCurrency(ibc * CURRENT_LEGAL_RATES.SALUD_EMPLEADOR),
    saludEmpleado: roundCurrency(ibc * CURRENT_LEGAL_RATES.SALUD_EMPLEADO),
    pensionEmpleador: roundCurrency(ibc * CURRENT_LEGAL_RATES.PENSION_EMPLEADOR),
    pensionEmpleado: roundCurrency(ibc * pensionEmpleadoRate),
    pensionEmpleadoRate,
    arlEmpleador: roundCurrency(ibc * ARL_RATE_MAP[input.arlRisk]),
    arlContratista: 0,
    arlTotal: roundCurrency(ibc * ARL_RATE_MAP[input.arlRisk]),
    ibc: roundCurrency(ibc),
  };
}
