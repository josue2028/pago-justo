import { useId, useState, type ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className="relative inline-flex"
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span aria-describedby={tooltipId}>{children}</span>
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 w-64 -translate-x-1/2 rounded-2xl bg-slate-950 px-3 py-2 text-xs text-white shadow-lg"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
