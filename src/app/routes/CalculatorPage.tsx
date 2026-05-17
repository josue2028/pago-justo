import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  FinalSettlementSimulator,
  SalaryIncreaseCalculator,
  ScenarioComparator,
  StepWizard,
  useCalculatorStore,
} from '@modules/calculator';
import { fromBase64Url } from '@shared/lib/validators';
import type { CalculatorInput } from '@domain/calculator/types/calculator.types';

export default function CalculatorPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const input = useCalculatorStore((state) => state.input);
  const result = useCalculatorStore((state) => state.result);
  const updateInput = useCalculatorStore((state) => state.updateInput);
  const [hasLoadedSharedInput, setHasLoadedSharedInput] = useState(false);

  useEffect(() => {
    const shared = searchParams.get('share');
    if (!shared || hasLoadedSharedInput) {
      return;
    }

    try {
      updateInput(JSON.parse(fromBase64Url(shared)) as Partial<CalculatorInput>);
      setHasLoadedSharedInput(true);
      toast.success('Calculo compartido cargado');
    } catch {
      toast.error('No se pudo cargar el enlace compartido');
    }
  }, [hasLoadedSharedInput, searchParams, updateInput]);

  const typedInput = useMemo(() => input as CalculatorInput, [input]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6">
      <div>
        <p className="text-sm font-medium text-brand-blue">Pago Justo</p>
        <h1 className="text-3xl font-bold">Calculadora laboral colombiana</h1>
      </div>
      <StepWizard />
      {result ? (
        <section className="grid gap-6 xl:grid-cols-3">
          <ScenarioComparator input={typedInput} />
          <SalaryIncreaseCalculator input={typedInput} />
          {typedInput.role === 'EMPLEADO_DEPENDIENTE' && typedInput.contractType ? (
            <FinalSettlementSimulator
              contractType={typedInput.contractType}
              baseSalary={typedInput.baseSalary}
              includesTransportAllowance={typedInput.includesTransportAllowance}
              startDate={typedInput.startDate}
            />
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
