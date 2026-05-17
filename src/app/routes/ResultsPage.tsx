import { Link, useNavigate } from 'react-router-dom';
import { ResultsDashboard, useCalculatorStore } from '@modules/calculator';
import { ExportPanel } from '@modules/export';
import { Button, Card } from '@shared/ui';
import type { CalculatorInput } from '@domain/calculator/types/calculator.types';

export default function ResultsPage(): JSX.Element {
  const navigate = useNavigate();
  const input = useCalculatorStore((state) => state.input);
  const result = useCalculatorStore((state) => state.result);
  const reset = useCalculatorStore((state) => state.reset);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-blue">Pago Justo</p>
          <h1 className="text-3xl font-bold">Resultados</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            variant="outline"
          >
            <Link to="/calculadora">Volver a la calculadora</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
        </div>
      </div>
      {result ? (
        <div className="space-y-6">
          <ResultsDashboard
            input={input as CalculatorInput}
            result={result}
          />
          <ExportPanel
            input={input}
            result={result}
            onReset={() => {
              reset();
              navigate('/calculadora');
            }}
            onGoHome={() => navigate('/')}
          />
        </div>
      ) : (
        <Card>
          <p className="font-semibold text-brand-text">Aun no hay un calculo disponible.</p>
          <p className="mt-2 text-sm text-brand-muted">Completa el wizard para generar resultados.</p>
        </Card>
      )}
    </main>
  );
}
