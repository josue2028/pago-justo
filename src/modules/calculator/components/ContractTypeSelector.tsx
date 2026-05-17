import { Card } from '@core/ui';
import type { ContractType, UserRole } from '@core/engine/types/calculator.types';
import { cn } from '@core/ui/utils';

interface ContractTypeSelectorProps {
  role: UserRole;
  value?: ContractType;
  onChange: (value: ContractType) => void;
}

const contracts: { value: ContractType; label: string; helper: string }[] = [
  { value: 'TERMINO_FIJO', label: 'Término fijo', helper: 'Con fecha pactada de finalización.' },
  { value: 'TERMINO_INDEFINIDO', label: 'Término indefinido', helper: 'Sin fecha de cierre predefinida.' },
  { value: 'OBRA_LABOR', label: 'Obra o labor', helper: 'Atado a una actividad o proyecto.' },
  { value: 'MEDIO_TIEMPO', label: 'Medio tiempo', helper: 'Con IBC mínimo del 50% del SMMLV.' },
];

export function ContractTypeSelector({ role, value, onChange }: ContractTypeSelectorProps): JSX.Element {
  if (role === 'CONTRATISTA_INDEPENDIENTE') {
    return (
      <Card className="bg-slate-50">
        <p className="font-semibold text-brand-text">No aplica tipo de contrato laboral</p>
        <p className="mt-2 text-sm text-brand-muted">
          En prestación de servicios el cálculo se hace sobre ingresos brutos e IBC del independiente.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {contracts.map((contract) => (
        <button
          key={contract.value}
          type="button"
          onClick={() => onChange(contract.value)}
          className="text-left"
        >
          <Card className={cn(value === contract.value && 'border-brand-blue bg-brand-blue/5')}>
            <p className="font-semibold text-brand-text">{contract.label}</p>
            <p className="mt-2 text-sm text-brand-muted">{contract.helper}</p>
          </Card>
        </button>
      ))}
    </div>
  );
}
