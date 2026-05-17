import { Link2 } from 'lucide-react';
import { Button } from '@core/ui';
import { toBase64Url } from '@core/utils/validators';
import type { CalculatorInput } from '@core/engine/types/calculator.types';

interface ShareableLinkProps {
  input: Partial<CalculatorInput>;
}

export function ShareableLink({ input }: ShareableLinkProps): JSX.Element {
  const handleCopy = async () => {
    const payload = toBase64Url(JSON.stringify(input));
    const url = `${window.location.origin}/calculadora?share=${payload}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void handleCopy()}
    >
      <Link2 className="mr-2 size-4" />
      Compartir enlace
    </Button>
  );
}
