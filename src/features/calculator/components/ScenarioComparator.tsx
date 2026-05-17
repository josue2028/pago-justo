import { compareScenarios } from '@core/engine/calculators';
import type { CalculatorInput } from '@core/engine/types/calculator.types';
import { Card } from '@core/ui';
import { formatCurrency } from '@core/utils/formatters';

interface ScenarioComparatorProps {
  input: CalculatorInput;
}

export function ScenarioComparator({ input }: ScenarioComparatorProps): JSX.Element {
  const comparison = compareScenarios(input, {
    ...input,
    contractType: input.contractType === 'TERMINO_FIJO' ? 'TERMINO_INDEFINIDO' : 'TERMINO_FIJO',
  });

  return (
    <Card className="space-y-3">
      <h3 className="font-semibold text-brand-text">Comparador de escenarios</h3>
      <p className="text-sm text-brand-muted">
        Diferencia de costo empleador: {formatCurrency(comparison.deltas.employerCost)}
      </p>
      <p className="text-sm text-brand-muted">
        Diferencia de neto empleado: {formatCurrency(comparison.deltas.employeeNet)}
      </p>
    </Card>
  );
}
