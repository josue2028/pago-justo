import { startTransition, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CalculatorInput } from '@core/engine/types/calculator.types';
import { Button, Card, Stepper } from '@core/ui';
import { useCalculatorStore } from '../stores/calculatorStore';
import { useWizardState } from '../hooks/useWizardState';
import { ContractTypeSelector } from './ContractTypeSelector';
import { ResultsDashboard } from './ResultsDashboard';
import { RoleSelector } from './RoleSelector';
import { SalaryInputForm } from './SalaryInputForm';

const steps = [
  'Tipo de vinculación',
  'Tipo de contrato',
  'Datos salariales',
  'Resultados',
];

export function StepWizard(): JSX.Element {
  const navigate = useNavigate();
  const input = useCalculatorStore((state) => state.input);
  const updateInput = useCalculatorStore((state) => state.updateInput);
  const calculate = useCalculatorStore((state) => state.calculate);
  const result = useCalculatorStore((state) => state.result);
  const { currentStep, setStep } = useWizardState(steps.length);
  const [isFormStepValid, setIsFormStepValid] = useState(false);

  const typedInput = useMemo(() => input as CalculatorInput, [input]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && currentStep < 4) {
        event.preventDefault();
        handleNext();
      }

      if (event.key === 'Escape' && currentStep > 1) {
        event.preventDefault();
        setStep(currentStep - 1);
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  });

  const handleNext = () => {
    if (currentStep === 3 && !isFormStepValid) {
      return;
    }

    if (currentStep === 3) {
      startTransition(() => {
        calculate();
        navigate('/resultados');
      });
    }

    if (currentStep < 4) {
      setStep(currentStep + 1);
    }
  };

  const handleRoleChange = (role: CalculatorInput['role']) => {
    updateInput({ role });
  };

  const handleContractTypeChange = (contractType: CalculatorInput['contractType']) => {
    updateInput({ contractType });
  };

  const handleRoleDoubleSelect = (role: CalculatorInput['role']) => {
    updateInput({ role });
    setStep(2);
  };

  const handleContractDoubleSelect = (contractType: CalculatorInput['contractType']) => {
    updateInput({ contractType });
    setStep(3);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="space-y-5 p-4 md:space-y-6 md:p-6">
        <Stepper
          currentStep={currentStep}
          totalSteps={steps.length}
          currentLabel={steps[currentStep - 1]}
        />
        <div
          aria-current="step"
          className="min-h-[20rem] transition-all md:min-h-[22rem]"
        >
          {currentStep === 1 ? (
            <RoleSelector
              value={input.role ?? 'EMPLEADO_DEPENDIENTE'}
              onChange={handleRoleChange}
              onDoubleSelect={handleRoleDoubleSelect}
            />
          ) : null}
          {currentStep === 2 ? (
            <ContractTypeSelector
              role={input.role ?? 'EMPLEADO_DEPENDIENTE'}
              value={input.contractType}
              onChange={handleContractTypeChange}
              onDoubleSelect={handleContractDoubleSelect}
            />
          ) : null}
          {currentStep === 3 ? (
            <SalaryInputForm
              initialValue={input}
              onChange={(value, isValid) => {
                updateInput(value);
                setIsFormStepValid(isValid);
              }}
            />
          ) : null}
          {currentStep === 4 && result ? (
            <ResultsDashboard
              input={typedInput}
              result={result}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => currentStep > 1 && setStep(currentStep - 1)}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 size-4" />
            Volver
          </Button>
          <Button
            type="button"
            onClick={handleNext}
          >
            {currentStep === 3 ? 'Calcular' : 'Continuar'}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
