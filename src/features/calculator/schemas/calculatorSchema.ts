import { z } from 'zod';
import { CURRENT_LEGAL_RATES } from '@core/engine/constants/colombiaRates';

export const calculatorSchema = z
  .object({
    role: z.enum(['EMPLEADO_DEPENDIENTE', 'CONTRATISTA_INDEPENDIENTE']),
    contractType: z
      .enum(['TERMINO_FIJO', 'TERMINO_INDEFINIDO', 'OBRA_LABOR', 'MEDIO_TIEMPO'])
      .optional(),
    baseSalary: z.number().min(0),
    startDate: z.date(),
    endDate: z.date(),
    arlRisk: z.enum(['RIESGO_I', 'RIESGO_II', 'RIESGO_III', 'RIESGO_IV', 'RIESGO_V']),
    includesTransportAllowance: z.boolean(),
    grossIncome: z.number().optional(),
    companySize: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    employerPersonType: z.enum(['JURIDICA', 'NATURAL']).optional(),
    employeeAge: z.number().min(18).max(100).optional(),
    isNewHireForYouthExemption: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.startDate > value.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'La fecha final debe ser igual o posterior a la fecha inicial.',
      });
    }

    if (
      value.role === 'EMPLEADO_DEPENDIENTE' &&
      value.contractType === 'MEDIO_TIEMPO' &&
      value.baseSalary < CURRENT_LEGAL_RATES.SMMLV * 0.5
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['baseSalary'],
        message: `Para medio tiempo el salario mínimo permitido es ${new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0,
        }).format(CURRENT_LEGAL_RATES.SMMLV * 0.5)}.`,
      });
    }

    if (value.role === 'CONTRATISTA_INDEPENDIENTE' && !value.grossIncome) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grossIncome'],
        message: 'Los ingresos brutos son obligatorios para contratistas.',
      });
    }

    if (
      value.role === 'EMPLEADO_DEPENDIENTE' &&
      value.contractType !== 'MEDIO_TIEMPO' &&
      value.baseSalary < CURRENT_LEGAL_RATES.SMMLV
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['baseSalary'],
        message: `El salario no puede ser menor al mínimo legal vigente de ${new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0,
        }).format(CURRENT_LEGAL_RATES.SMMLV)}.`,
      });
    }
  });

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;
