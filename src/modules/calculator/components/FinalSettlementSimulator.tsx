import { useMemo, useState } from 'react';
import { calculateFinalSettlement } from '@core/engine/calculators';
import type { ContractType, TerminationCause } from '@core/engine/types/calculator.types';
import { Card, Input } from '@core/ui';
import { formatCurrency } from '@core/utils/formatters';

interface FinalSettlementSimulatorProps {
  contractType: ContractType;
  baseSalary: number;
  includesTransportAllowance: boolean;
  startDate: Date;
}

export function FinalSettlementSimulator({
  contractType,
  baseSalary,
  includesTransportAllowance,
  startDate,
}: FinalSettlementSimulatorProps): JSX.Element {
  const [cause, setCause] = useState<TerminationCause>('RENUNCIA');
  const [effectiveEndDate, setEffectiveEndDate] = useState(toDateInputValue(new Date()));
  const [scheduledEndDate, setScheduledEndDate] = useState(toDateInputValue(new Date()));
  const [estimatedRemainingDays, setEstimatedRemainingDays] = useState(15);
  const [pendingWorkedDays, setPendingWorkedDays] = useState(15);

  const settlement = useMemo(
    () =>
      calculateFinalSettlement({
        contractType,
        baseSalary,
        startDate,
        endDate: fromDateInputValue(effectiveEndDate),
        cause,
        includesTransportAllowance,
        scheduledContractEndDate:
          contractType === 'TERMINO_FIJO' ? fromDateInputValue(scheduledEndDate) : undefined,
        estimatedRemainingDays: contractType === 'OBRA_LABOR' ? estimatedRemainingDays : undefined,
        pendingWorkedDays,
      }),
    [
      baseSalary,
      cause,
      contractType,
      effectiveEndDate,
      estimatedRemainingDays,
      includesTransportAllowance,
      pendingWorkedDays,
      scheduledEndDate,
      startDate,
    ],
  );

  return (
    <Card className="space-y-4">
      <h3 className="font-semibold text-brand-text">Simulador de liquidación final</h3>
      <div className="grid gap-4">
        <label className="space-y-2 text-sm font-medium text-brand-text">
          <span>Causa de retiro</span>
          <select
            className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={cause}
            onChange={(event) => setCause(event.target.value as TerminationCause)}
          >
            <option value="RENUNCIA">Renuncia</option>
            <option value="DESPIDO_SIN_JUSTA_CAUSA">Despido sin justa causa</option>
            <option value="DESPIDO_CON_JUSTA_CAUSA">Despido con justa causa</option>
            <option value="MUTUO_ACUERDO">Mutuo acuerdo</option>
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-brand-text">
          <span>Fecha efectiva de retiro</span>
          <Input
            type="date"
            value={effectiveEndDate}
            onChange={(event) => setEffectiveEndDate(event.target.value)}
          />
        </label>

        {contractType === 'TERMINO_FIJO' ? (
          <label className="space-y-2 text-sm font-medium text-brand-text">
            <span>Fecha pactada de finalización</span>
            <Input
              type="date"
              value={scheduledEndDate}
              onChange={(event) => setScheduledEndDate(event.target.value)}
            />
          </label>
        ) : null}

        {contractType === 'OBRA_LABOR' ? (
          <label className="space-y-2 text-sm font-medium text-brand-text">
            <span>Días estimados faltantes de la obra</span>
            <Input
              type="number"
              min={1}
              value={estimatedRemainingDays}
              onChange={(event) => setEstimatedRemainingDays(Number(event.target.value))}
            />
          </label>
        ) : null}

        <label className="space-y-2 text-sm font-medium text-brand-text">
          <span>Días pendientes por pagar en el último corte</span>
          <Input
            type="number"
            min={0}
            max={30}
            value={pendingWorkedDays}
            onChange={(event) => setPendingWorkedDays(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Metric
          label="Salario pendiente"
          value={settlement.salaryPending}
        />
        <Metric
          label="Auxilio pendiente"
          value={settlement.transportAllowancePending}
        />
        <Metric
          label="Indemnización"
          value={settlement.indemnizacion}
        />
        <Metric
          label="Total liquidación"
          value={settlement.totalSettlement}
        />
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-brand-muted">
      {label}: <strong className="text-brand-text">{formatCurrency(value)}</strong>
    </div>
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
