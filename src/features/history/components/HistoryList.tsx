import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { Button, Card } from '@core/ui';
import { formatCurrency } from '@core/utils/formatters';
import type { HistoryEntry } from '../hooks/useHistory';

interface HistoryListProps {
  entries: HistoryEntry[];
  onDelete: (id: string) => void;
  onReload: (entry: HistoryEntry) => void;
}

export function HistoryList({ entries, onDelete, onReload }: HistoryListProps): JSX.Element {
  if (entries.length === 0) {
    return (
      <Card>
        <p className="font-semibold text-brand-text">Aún no hay cálculos guardados</p>
        <p className="mt-2 text-sm text-brand-muted">Haz tu primer cálculo y guárdalo para volver a abrirlo.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="font-semibold text-brand-text">
              {entry.input.role === 'EMPLEADO_DEPENDIENTE' ? 'Empleado' : 'Contratista'}
            </p>
            <p className="text-sm text-brand-muted">
              {format(new Date(entry.createdAt), "dd MMM yyyy '·' HH:mm", { locale: es })}
            </p>
            <p className="mt-2 text-sm text-brand-muted">
              Neto: {formatCurrency(entry.result.summary.employeeNet)}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onReload(entry)}
            >
              Reabrir
            </Button>
            <Button
              variant="ghost"
              onClick={() => onDelete(entry.id)}
            >
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
