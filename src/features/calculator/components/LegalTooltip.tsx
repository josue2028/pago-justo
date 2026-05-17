import { Info } from 'lucide-react';
import { Tooltip } from '@core/ui';

interface LegalTooltipProps {
  text: string;
  href: string;
}

export function LegalTooltip({ text, href }: LegalTooltipProps): JSX.Element {
  return (
    <Tooltip
      content={
        <div className="space-y-2">
          <p>{text}</p>
          <a
            className="font-semibold text-brand-yellow"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            Leer más
          </a>
        </div>
      }
    >
      <span
        role="button"
        tabIndex={0}
        aria-label="Ver ayuda legal"
        className="inline-flex size-5 items-center justify-center rounded-full bg-slate-100 text-brand-muted"
      >
        <Info className="size-3.5" />
      </span>
    </Tooltip>
  );
}
