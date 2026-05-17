import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { HistoryList, useHistory } from '@features/history';
import { Button } from '@core/ui';
import { useCalculatorStore } from '@features/calculator';

export default function HistoryPage(): JSX.Element {
  const { entries, remove, clear } = useHistory();
  const updateInput = useCalculatorStore((state) => state.updateInput);
  const setStep = useCalculatorStore((state) => state.setStep);
  const navigate = useNavigate();

  const exportCsv = () => {
    const csv = entries
      .map(
        (entry) =>
          `${entry.createdAt},${entry.input.role},${entry.input.baseSalary},${entry.result.summary.employeeNet}`,
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pago-justo-history.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Historial de cálculos</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={exportCsv}
          >
            <Download className="mr-2 size-4" />
            Exportar CSV
          </Button>
          <Button
            variant="ghost"
            onClick={clear}
          >
            Limpiar
          </Button>
        </div>
      </div>
      <HistoryList
        entries={entries}
        onDelete={remove}
        onReload={(entry) => {
          updateInput(entry.input);
          setStep(4);
          navigate('/calculadora?step=4');
        }}
      />
    </main>
  );
}
