import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepWizard, useCalculatorStore } from '@modules/calculator';

describe('StepWizard', () => {
  it('avanza entre pasos', async () => {
    const user = userEvent.setup();
    useCalculatorStore.getState().reset();

    render(
      <MemoryRouter>
        <StepWizard />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByText(/término fijo/i)).toBeInTheDocument();
  });
});
