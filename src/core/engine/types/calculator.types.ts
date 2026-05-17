export type ContractType =
  | 'TERMINO_FIJO'
  | 'TERMINO_INDEFINIDO'
  | 'OBRA_LABOR'
  | 'MEDIO_TIEMPO';

export type UserRole = 'EMPLEADO_DEPENDIENTE' | 'CONTRATISTA_INDEPENDIENTE';

export type ArlRisk = 'RIESGO_I' | 'RIESGO_II' | 'RIESGO_III' | 'RIESGO_IV' | 'RIESGO_V';

export type CompanySize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type EmployerPersonType = 'JURIDICA' | 'NATURAL';

export type TerminationCause =
  | 'RENUNCIA'
  | 'DESPIDO_SIN_JUSTA_CAUSA'
  | 'DESPIDO_CON_JUSTA_CAUSA'
  | 'MUTUO_ACUERDO';

export interface CalculatorInput {
  role: UserRole;
  contractType?: ContractType;
  baseSalary: number;
  startDate: Date;
  endDate: Date;
  arlRisk: ArlRisk;
  includesTransportAllowance: boolean;
  grossIncome?: number;
  companySize?: CompanySize;
  employerPersonType?: EmployerPersonType;
  employeeAge?: number;
  isNewHireForYouthExemption?: boolean;
}

export interface SocialSecurityResult {
  saludEmpleador: number;
  saludEmpleado: number;
  pensionEmpleador: number;
  pensionEmpleado: number;
  pensionEmpleadoRate: number;
  arlEmpleador: number;
  arlContratista: number;
  arlTotal: number;
  ibc: number;
}

export interface ParafiscalesResult {
  cajaCompensacion: number;
  icbf: number;
  sena: number;
  payrollBase: number;
  exempted: boolean;
}

export interface BenefitsResult {
  prima: number;
  cesantias: number;
  interesesCesantias: number;
  vacaciones: number;
  baseWithAllowance: number;
  baseWithoutAllowance: number;
}

export interface SummaryResult {
  grossSalaryPeriod: number;
  transportAllowancePeriod: number;
  employerCost: number;
  employeeNet: number;
  totalSocialSecurity: number;
  totalBenefits: number;
  totalParafiscales: number;
}

export interface LegalReference {
  label: string;
  detail: string;
  href: string;
}

export interface CalculationMetadata {
  ratesYear: number;
  smmlv: number;
  calculatedAt: Date;
  workingDays: number;
  periodRatio: number;
}

export interface CalculatorResult {
  socialSecurity: SocialSecurityResult;
  parafiscales: ParafiscalesResult | null;
  benefits: BenefitsResult | null;
  summary: SummaryResult;
  legalReferences: LegalReference[];
  metadata: CalculationMetadata;
}

export interface ScenarioComparison {
  base: CalculatorResult;
  target: CalculatorResult;
  deltas: Record<'employerCost' | 'employeeNet' | 'socialSecurity' | 'benefits', number>;
}

export interface SalaryIncreaseResult {
  current: CalculatorResult;
  projected: CalculatorResult;
  increasePercentage: number;
}

export interface FinalSettlementInput {
  contractType: ContractType;
  baseSalary: number;
  startDate: Date;
  endDate: Date;
  cause: TerminationCause;
  includesTransportAllowance: boolean;
  scheduledContractEndDate?: Date;
  estimatedRemainingDays?: number;
  pendingWorkedDays?: number;
}

export interface FinalSettlementResult {
  benefits: BenefitsResult;
  salaryPending: number;
  transportAllowancePending: number;
  indemnizacion: number;
  totalSettlement: number;
}
