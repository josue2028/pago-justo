import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';
import { CurrencyInput } from '@shared/ui';

describe('CurrencyInput', () => {
  it('formatea moneda y conserva aria-label', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Wrapper onValueChange={handleChange} />,
    );

    const input = screen.getByLabelText('Salario');
    await user.type(input, '1300000');

    expect(handleChange).toHaveBeenLastCalledWith(1300000);
    expect(screen.getByText('$')).toBeInTheDocument();
    await user.clear(input);
    expect(handleChange).toHaveBeenLastCalledWith(0);
  });
});

function Wrapper({ onValueChange }: { onValueChange: (value: number) => void }) {
  const [value, setValue] = useState(0);

  return (
    <CurrencyInput
      id="salary"
      label="Salario"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange(next);
      }}
    />
  );
}
