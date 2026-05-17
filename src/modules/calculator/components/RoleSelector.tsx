import { BriefcaseBusiness, FileText } from 'lucide-react';
import { Card } from '@core/ui';
import type { UserRole } from '@core/engine/types/calculator.types';
import { cn } from '@core/ui/utils';
import { LegalTooltip } from './LegalTooltip';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (value: UserRole) => void;
  onDoubleSelect?: (value: UserRole) => void;
}

const options = [
  {
    value: 'EMPLEADO_DEPENDIENTE' as const,
    title: 'Contrato laboral',
    description: 'Incluye salario, prestaciones, parafiscales y aportes compartidos.',
    icon: BriefcaseBusiness,
  },
  {
    value: 'CONTRATISTA_INDEPENDIENTE' as const,
    title: 'Prestación de servicios',
    description: 'Liquida aportes del independiente sobre su ingreso base de cotización.',
    icon: FileText,
  },
];

export function RoleSelector({ value, onChange, onDoubleSelect }: RoleSelectorProps): JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            onDoubleClick={() => onDoubleSelect?.(option.value)}
            className="text-left"
          >
            <Card className={cn(isActive && 'border-brand-blue bg-brand-blue/5')}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3">
                    <Icon className="size-5 text-brand-blue" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-brand-text">{option.title}</p>
                    <p className="text-sm text-brand-muted">{option.description}</p>
                  </div>
                </div>
                <LegalTooltip
                  text="Define si existe contrato laboral o una relación de prestación de servicios."
                  href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=33104"
                />
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
