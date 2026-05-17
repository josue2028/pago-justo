import { useState } from 'react';
import { calculateSalaryIncrease } from '@core/engine/calculators';
import type { CalculatorInput } from '@core/engine/types/calculator.types';
import { Card, Input } from '@core/ui';
import { formatCurrency } from '@core/utils/formatters';

interface SalaryIncreaseCalculatorProps {
  input: CalculatorInput;
}

export function SalaryIncreaseCalculator({ input }: SalaryIncreaseCalculatorProps): JSX.Element {
  const [percentage, setPercentage] = useState(10);
  const result = calculateSalaryIncrease(input, percentage);

  return (
    <Card className="space-y-4">
      <div className="flex items-end gap-4">
        <label className="flex-1 space-y-2 text-sm font-medium text-brand-text">
          <span>% de aumento</span>
          <Input
            type="number"
            min={1}
            value={percentage}
            onChange={(event) => setPercentage(Number(event.target.value))}
          />
        </label>
      </div>
      <p className="text-sm text-brand-muted">
        Nuevo costo empleador: {formatCurrency(result.projected.summary.employerCost)}
      </p>
      <p className="text-sm text-brand-muted">Nuevo neto empleado: {formatCurrency(result.projected.summary.employeeNet)}</p>
    </Card>
  );
}
