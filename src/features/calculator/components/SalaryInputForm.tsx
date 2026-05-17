import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { Card, CurrencyInput, Input } from '@core/ui';
import { CURRENT_LEGAL_RATES } from '@core/engine/constants/colombiaRates';
import type { CalculatorInput } from '@core/engine/types/calculator.types';
import { calculatorSchema, type CalculatorFormValues } from '../schemas/calculatorSchema';

interface SalaryInputFormProps {
  initialValue: Partial<CalculatorInput>;
  onChange: (value: Partial<CalculatorInput>, isValid: boolean) => void;
}

const defaultValues: CalculatorFormValues = {
  role: 'EMPLEADO_DEPENDIENTE',
  contractType: 'TERMINO_INDEFINIDO',
  baseSalary: CURRENT_LEGAL_RATES.SMMLV,
  startDate: new Date('2026-03-01T00:00:00.000Z'),
  endDate: addDays(new Date(), 0),
  arlRisk: 'RIESGO_I',
  includesTransportAllowance: true,
  grossIncome: undefined,
  companySize: 'SMALL',
  employerPersonType: 'JURIDICA',
  employeeAge: 27,
  isNewHireForYouthExemption: false,
};

export function SalaryInputForm({ initialValue, onChange }: SalaryInputFormProps): JSX.Element {
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    mode: 'onChange',
    defaultValues: {
      ...defaultValues,
      ...initialValue,
    },
  });

  const watchValues = form.watch();
  const salarySuggestion = useMemo(
    () => watchValues.baseSalary <= CURRENT_LEGAL_RATES.SMMLV * 2,
    [watchValues.baseSalary],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onChange(
        {
          ...watchValues,
          includesTransportAllowance:
            watchValues.role === 'EMPLEADO_DEPENDIENTE'
              ? watchValues.includesTransportAllowance && salarySuggestion
              : false,
        },
        form.formState.isValid,
      );
    }, 300);

    return () => window.clearTimeout(timer);
  }, [form.formState.isValid, onChange, salarySuggestion, watchValues]);

  const fieldError = (name: keyof CalculatorFormValues) => form.formState.errors[name]?.message;

  return (
    <Card className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {watchValues.role === 'EMPLEADO_DEPENDIENTE' ? (
          <Field
            error={fieldError('baseSalary')}
            label="Salario base mensual"
          >
            <CurrencyInput
              id="baseSalary"
              label="Salario base mensual"
              value={watchValues.baseSalary}
              onValueChange={(value) => void form.setValue('baseSalary', value, { shouldValidate: true })}
              ariaDescribedBy="baseSalary-error"
              hasError={Boolean(fieldError('baseSalary'))}
            />
          </Field>
        ) : (
          <Field
            error={fieldError('grossIncome')}
            label="Ingresos brutos del mes"
          >
            <CurrencyInput
              id="grossIncome"
              label="Ingresos brutos del mes"
              value={watchValues.grossIncome ?? 0}
              onValueChange={(value) => void form.setValue('grossIncome', value, { shouldValidate: true })}
              ariaDescribedBy="grossIncome-error"
              hasError={Boolean(fieldError('grossIncome'))}
            />
          </Field>
        )}

        {watchValues.role === 'CONTRATISTA_INDEPENDIENTE' ? (
          <Field
            error={undefined}
            label="Base mínima legal de cotización"
          >
            <Input
              id="independentFloor"
              readOnly
              value={formatCOP(CURRENT_LEGAL_RATES.SMMLV)}
            />
          </Field>
        ) : (
          <Field
            error={undefined}
            label="Tipo de persona empleadora"
          >
            <select
              className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              value={watchValues.employerPersonType}
              onChange={(event) =>
                void form.setValue(
                  'employerPersonType',
                  event.target.value as CalculatorFormValues['employerPersonType'],
                )
              }
            >
              <option value="JURIDICA">Jurídica</option>
              <option value="NATURAL">Natural</option>
            </select>
          </Field>
        )}

        {watchValues.role === 'EMPLEADO_DEPENDIENTE' ? (
          <Field
            error={undefined}
            label="Tamaño de empresa"
          >
            <select
              className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              value={watchValues.companySize}
              onChange={(event) =>
                void form.setValue('companySize', event.target.value as CalculatorFormValues['companySize'])
              }
            >
              <option value="SMALL">Pequeña</option>
              <option value="MEDIUM">Mediana</option>
              <option value="LARGE">Grande</option>
            </select>
          </Field>
        ) : null}

        <Field
          error={fieldError('startDate')}
          label={watchValues.role === 'EMPLEADO_DEPENDIENTE' ? 'Fecha de inicio del contrato' : 'Inicio del período'}
        >
          <Input
            id="startDate"
            type="date"
            value={toDateInputValue(watchValues.startDate)}
            onChange={(event) =>
              void form.setValue('startDate', fromDateInputValue(event.target.value), { shouldValidate: true })
            }
          />
        </Field>

        <Field
          error={fieldError('endDate')}
          label="Fecha fin del período"
        >
          <Input
            id="endDate"
            type="date"
            value={toDateInputValue(watchValues.endDate)}
            onChange={(event) =>
              void form.setValue('endDate', fromDateInputValue(event.target.value), { shouldValidate: true })
            }
          />
        </Field>

        <Field
          error={undefined}
          label="Nivel de riesgo ARL"
        >
          <select
            className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={watchValues.arlRisk}
            onChange={(event) => void form.setValue('arlRisk', event.target.value as CalculatorFormValues['arlRisk'])}
          >
            <option value="RIESGO_I">Riesgo I · Administrativo</option>
            <option value="RIESGO_II">Riesgo II · Operativo leve</option>
            <option value="RIESGO_III">Riesgo III · Operativo medio</option>
            <option value="RIESGO_IV">Riesgo IV · Alto</option>
            <option value="RIESGO_V">Riesgo V · Máximo</option>
          </select>
        </Field>

        <Field
          error={undefined}
          label="Edad del trabajador"
        >
          <Input
            id="employeeAge"
            type="number"
            min={18}
            value={watchValues.employeeAge ?? 27}
            onChange={(event) => void form.setValue('employeeAge', Number(event.target.value))}
          />
        </Field>
      </div>

      {watchValues.role === 'EMPLEADO_DEPENDIENTE' ? (
        <>
          <ToggleRow
            checked={watchValues.includesTransportAllowance && salarySuggestion}
            description="Sugerido automáticamente cuando el salario es igual o menor a 2 SMMLV."
            label="Aplicar auxilio de transporte"
            onChange={(checked) =>
              void form.setValue('includesTransportAllowance', checked, { shouldValidate: true })
            }
          />
          <ToggleRow
            checked={watchValues.isNewHireForYouthExemption ?? false}
            description="Solo para nuevo personal entre 18 y 28 años y cumpliendo los requisitos de incremento de nómina."
            label="Aplica exención Ley 1780 en caja"
            onChange={(checked) =>
              void form.setValue('isNewHireForYouthExemption', checked, { shouldValidate: true })
            }
          />
        </>
      ) : null}
    </Card>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: JSX.Element;
}): JSX.Element {
  return (
    <label className="space-y-2 text-sm font-medium text-brand-text">
      <span>{label}</span>
      {children}
      {error ? (
        <span
          role="alert"
          aria-live="polite"
          className="text-sm text-brand-error"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

function ToggleRow({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
}): JSX.Element {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
      <span>
        <span className="block font-medium text-brand-text">{label}</span>
        <span className="text-sm text-brand-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        className="size-5 rounded"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function toDateInputValue(value: Date): string {
  return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}-${String(
    value.getUTCDate(),
  ).padStart(2, '0')}`;
}

function fromDateInputValue(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}
