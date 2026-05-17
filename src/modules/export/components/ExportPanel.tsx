import { Download, Home, RefreshCcw } from 'lucide-react';
import { Button, Card } from '@core/ui';
import type { CalculatorInput, CalculatorResult } from '@core/engine/types/calculator.types';
import { useExport } from '../hooks/useExport';

interface ExportPanelProps {
  input: Partial<CalculatorInput>;
  result: CalculatorResult;
  onReset: () => void;
  onGoHome: () => void;
}

export function ExportPanel({ input, result, onReset, onGoHome }: ExportPanelProps): JSX.Element {
  const { exportToPdf } = useExport();

  return (
    <Card className="border-slate-200 bg-white">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-brand-blue">Siguiente paso</p>
          <h3 className="text-xl font-semibold text-brand-text">Exporta el resultado o inicia un nuevo calculo</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Button onClick={() => void exportToPdf(result, input)}>
            <Download className="mr-2 size-4" />
            Exportar PDF
          </Button>
          <Button
            variant="ghost"
            onClick={onReset}
          >
            <RefreshCcw className="mr-2 size-4" />
            Nuevo calculo
          </Button>
          <Button
            variant="outline"
            onClick={onGoHome}
          >
            <Home className="mr-2 size-4" />
            Volver al inicio
          </Button>
        </div>
      </div>
    </Card>
  );
}
