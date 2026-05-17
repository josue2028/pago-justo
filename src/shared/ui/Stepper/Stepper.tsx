import * as Progress from '@radix-ui/react-progress';
import { cn } from '../utils';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  currentLabel: string;
}

export function Stepper({ currentStep, totalSteps, currentLabel }: StepperProps): JSX.Element {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-brand-text">{currentLabel}</p>
        <span className="text-brand-muted">{percentage}%</span>
      </div>
      <Progress.Root
        className="relative h-3 overflow-hidden rounded-full bg-slate-200"
        value={percentage}
      >
        <Progress.Indicator
          className={cn('h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-yellow transition-all')}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </Progress.Root>
    </div>
  );
}
