import { render, screen } from '@testing-library/react';
import { calculateAll } from '@domain/calculator/calculators';
import type { CalculatorInput } from '@domain/calculator/types/calculator.types';
import { ResultsDashboard } from '@modules/calculator';

describe('ResultsDashboard', () => {
  it('renderiza metricas principales', () => {
    const input: CalculatorInput = {
      role: 'EMPLEADO_DEPENDIENTE',
      contractType: 'TERMINO_INDEFINIDO',
      baseSalary: 2000000,
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T00:00:00.000Z'),
      arlRisk: 'RIESGO_I',
      includesTransportAllowance: false,
      employerPersonType: 'JURIDICA',
    };
    const result = calculateAll(input);

    render(
      <ResultsDashboard
        input={input}
        result={result}
      />,
    );

    expect(screen.getByText(/Costo total empleador/i)).toBeInTheDocument();
    expect(screen.getByText(/Prestaciones del periodo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Exento/i).length).toBeGreaterThan(0);
  });

  it('muestra prestaciones y parafiscales en cero para contratistas', () => {
    const input: CalculatorInput = {
      role: 'CONTRATISTA_INDEPENDIENTE',
      baseSalary: 1750905,
      grossIncome: 3000000,
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T00:00:00.000Z'),
      arlRisk: 'RIESGO_I',
      includesTransportAllowance: false,
    };
    const result = calculateAll(input);

    render(
      <ResultsDashboard
        input={input}
        result={result}
      />,
    );

    expect(screen.getByText(/Parafiscales/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$0 por prestacion de servicios/i).length).toBeGreaterThan(0);
  });
});
