import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCalculatorStore } from '../stores/calculatorStore';

export function useWizardState(totalSteps: number) {
  const currentStep = useCalculatorStore((state) => state.currentStep);
  const setStep = useCalculatorStore((state) => state.setStep);
  const [searchParams, setSearchParams] = useSearchParams();
  const hasLoadedFromQuery = useRef(false);

  useEffect(() => {
    if (hasLoadedFromQuery.current) {
      return;
    }

    const current = Number(searchParams.get('step') ?? '1');
    if (current >= 1 && current <= totalSteps && current !== currentStep) {
      setStep(current);
    }
    hasLoadedFromQuery.current = true;
  }, [currentStep, searchParams, setStep, totalSteps]);

  useEffect(() => {
    if (searchParams.get('step') !== String(currentStep)) {
      setSearchParams((params) => {
        params.set('step', String(currentStep));
        return params;
      }, { replace: true });
    }
  }, [currentStep, searchParams, setSearchParams]);

  return { currentStep, setStep };
}
