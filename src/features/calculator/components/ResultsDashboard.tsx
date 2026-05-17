import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Badge, Card } from '@core/ui';
import { CURRENT_LEGAL_RATES } from '@core/engine/constants/colombiaRates';
import { formatCurrency, formatDateRange, formatPercentage } from '@core/utils/formatters';
import type { CalculatorInput, CalculatorResult } from '@core/engine/types/calculator.types';
import { ResultCard } from './ResultCard';

interface ResultsDashboardProps {
  input: Partial<CalculatorInput>;
  result: CalculatorResult;
}

const COLORS = ['#1E6FD9', '#F4A62A', '#22C55E', '#0F172A', '#94A3B8'];

export function ResultsDashboard({ input, result }: ResultsDashboardProps): JSX.Element {
  const isIndependent = input.role === 'CONTRATISTA_INDEPENDIENTE';

  const chartData = [
    { name: isIndependent ? 'Neto contratista' : 'Neto empleado', value: result.summary.employeeNet },
    {
      name: isIndependent ? 'Salud y pension contratista' : 'SS empleado',
      value: result.socialSecurity.saludEmpleado + result.socialSecurity.pensionEmpleado,
    },
    {
      name: 'SS empleador/contratante',
      value: result.socialSecurity.saludEmpleador + result.socialSecurity.pensionEmpleador + result.socialSecurity.arlEmpleador,
    },
    { name: 'Parafiscales', value: result.summary.totalParafiscales },
    { name: 'Prestaciones', value: result.summary.totalBenefits },
  ];
  const visibleChartData = chartData.filter((entry) => entry.value > 0);
  const totalDistribution = visibleChartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-muted">
              {isIndependent
                ? 'Liquidacion contratista independiente'
                : `Liquidacion empleado - ${humanizeContract(input.contractType)}`}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-brand-text">
              {formatDateRange(input.startDate ?? new Date(), input.endDate ?? new Date())} - {result.metadata.workingDays} dias
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{humanizeContract(input.contractType)}</Badge>
            <Badge>{isIndependent ? 'Contratista' : 'Empleado'}</Badge>
            <Badge>{input.arlRisk?.replace('_', ' ')}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label={isIndependent ? 'Valor del contrato' : 'Costo total empleador'}
          value={result.summary.employerCost}
          subtitle={isIndependent ? 'Ingreso bruto del periodo' : 'Salario, aportes, parafiscales y prestaciones'}
          variant="primary"
        />
        <ResultCard
          label={isIndependent ? 'Neto del contratista' : 'Neto a pagar'}
          value={result.summary.employeeNet}
          subtitle={isIndependent ? 'Ingreso menos aportes obligatorios' : 'Ingreso menos descuentos del trabajador'}
          variant="secondary"
        />
        <ResultCard
          label="Total seguridad social"
          value={result.summary.totalSocialSecurity}
          subtitle="Suma de salud, pension y ARL"
          variant="warning"
        />
        <ResultCard
          label="Prestaciones del periodo"
          value={result.summary.totalBenefits}
          subtitle="En prestacion de servicios se muestran en $0"
          variant="primary"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="space-y-4">
          <details open>
            <summary className="cursor-pointer font-semibold text-brand-text">Seguridad social y responsables</summary>
            <DataTable
              headers={[
                'Concepto',
                'Base',
                '% empleador/contratante',
                'Valor empleador/contratante',
                '% trabajador/contratista',
                'Valor trabajador/contratista',
              ]}
              rows={[
                [
                  'Salud',
                  formatCurrency(result.socialSecurity.ibc),
                  isIndependent
                    ? '-'
                    : result.socialSecurity.saludEmpleador === 0
                      ? 'Exento'
                      : formatPercentage(CURRENT_LEGAL_RATES.SALUD_EMPLEADOR),
                  isIndependent ? '-' : formatCurrency(result.socialSecurity.saludEmpleador),
                  isIndependent
                    ? formatPercentage(CURRENT_LEGAL_RATES.SALUD_EMPLEADOR + CURRENT_LEGAL_RATES.SALUD_EMPLEADO)
                    : formatPercentage(CURRENT_LEGAL_RATES.SALUD_EMPLEADO),
                  formatCurrency(result.socialSecurity.saludEmpleado),
                ],
                [
                  'Pension',
                  formatCurrency(result.socialSecurity.ibc),
                  isIndependent ? '-' : formatPercentage(CURRENT_LEGAL_RATES.PENSION_EMPLEADOR),
                  isIndependent ? '-' : formatCurrency(result.socialSecurity.pensionEmpleador),
                  formatPercentage(result.socialSecurity.pensionEmpleadoRate),
                  formatCurrency(result.socialSecurity.pensionEmpleado),
                ],
                [
                  'ARL',
                  formatCurrency(result.socialSecurity.ibc),
                  formatPercentage(getArlRate(input.arlRisk)),
                  formatCurrency(result.socialSecurity.arlEmpleador),
                  result.socialSecurity.arlContratista > 0 ? formatPercentage(getArlRate(input.arlRisk)) : '-',
                  formatCurrency(result.socialSecurity.arlContratista),
                ],
              ]}
            />
          </details>

          <details open>
            <summary className="cursor-pointer font-semibold text-brand-text">Parafiscales</summary>
            <DataTable
              headers={['Concepto', 'Base', '%', 'Valor', 'Responsable', 'Estado']}
              rows={[
                [
                  'Caja de compensacion',
                  formatCurrency(result.parafiscales?.payrollBase ?? 0),
                  isIndependent ? '-' : formatPercentage(CURRENT_LEGAL_RATES.CAJA_COMPENSACION),
                  formatCurrency(result.parafiscales?.cajaCompensacion ?? 0),
                  isIndependent ? 'No aplica' : 'Empleador',
                  isIndependent ? '$0' : 'Aplica',
                ],
                [
                  'ICBF',
                  formatCurrency(result.parafiscales?.payrollBase ?? 0),
                  isIndependent ? '-' : result.parafiscales?.exempted ? 'Exento' : formatPercentage(CURRENT_LEGAL_RATES.ICBF),
                  formatCurrency(result.parafiscales?.icbf ?? 0),
                  isIndependent ? 'No aplica' : 'Empleador',
                  isIndependent ? '$0' : result.parafiscales?.exempted ? 'Exento' : 'Aplica',
                ],
                [
                  'SENA',
                  formatCurrency(result.parafiscales?.payrollBase ?? 0),
                  isIndependent ? '-' : result.parafiscales?.exempted ? 'Exento' : formatPercentage(CURRENT_LEGAL_RATES.SENA),
                  formatCurrency(result.parafiscales?.sena ?? 0),
                  isIndependent ? 'No aplica' : 'Empleador',
                  isIndependent ? '$0' : result.parafiscales?.exempted ? 'Exento' : 'Aplica',
                ],
              ]}
            />
          </details>

          <details open>
            <summary className="cursor-pointer font-semibold text-brand-text">Prestaciones sociales</summary>
            <DataTable
              headers={['Concepto', 'Base', 'Formula', 'Periodo', 'Valor', 'Observacion']}
              rows={[
                [
                  'Prima de servicios',
                  formatCurrency(result.benefits?.baseWithAllowance ?? 0),
                  isIndependent ? 'No aplica' : '(Salario + auxilio) x dias / 360',
                  `${result.metadata.workingDays} dias`,
                  formatCurrency(result.benefits?.prima ?? 0),
                  isIndependent ? '$0 por prestacion de servicios' : 'Base incluye auxilio',
                ],
                [
                  'Cesantias',
                  formatCurrency(result.benefits?.baseWithAllowance ?? 0),
                  isIndependent ? 'No aplica' : '(Salario + auxilio) x dias / 360',
                  `${result.metadata.workingDays} dias`,
                  formatCurrency(result.benefits?.cesantias ?? 0),
                  isIndependent ? '$0 por prestacion de servicios' : 'Base incluye auxilio',
                ],
                [
                  'Intereses sobre cesantias',
                  formatCurrency(result.benefits?.cesantias ?? 0),
                  isIndependent ? 'No aplica' : 'Cesantias x 12% x dias / 360',
                  `${result.metadata.workingDays} dias`,
                  formatCurrency(result.benefits?.interesesCesantias ?? 0),
                  isIndependent ? '$0 por prestacion de servicios' : 'La paga el empleador',
                ],
                [
                  'Vacaciones',
                  formatCurrency(result.benefits?.baseWithoutAllowance ?? 0),
                  isIndependent ? 'No aplica' : 'Salario x 15 / 360',
                  `${result.metadata.workingDays} dias`,
                  formatCurrency(result.benefits?.vacaciones ?? 0),
                  isIndependent ? '$0 por prestacion de servicios' : 'Se calculan solo sobre salario',
                ],
                [
                  'Auxilio de transporte',
                  formatCurrency(result.summary.transportAllowancePeriod),
                  isIndependent ? 'No aplica' : 'Auxilio vigente x proporcion del periodo',
                  `${result.metadata.workingDays} dias`,
                  formatCurrency(result.summary.transportAllowancePeriod),
                  isIndependent ? '$0 por prestacion de servicios' : 'Solo si devenga hasta 2 SMMLV',
                ],
              ]}
            />
          </details>
        </Card>

        <Card className="space-y-4">
          <h3 className="font-semibold text-brand-text">Distribucion del calculo</h3>
          <div className="rounded-[1.75rem] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-sm">
            <div className="relative mx-auto h-80 w-full max-w-[360px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={visibleChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={82}
                    outerRadius={122}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={4}
                  >
                    {visibleChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white px-6 py-5 text-center shadow-sm ring-1 ring-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted">Total</p>
                  <p className="mt-1 text-lg font-bold leading-none text-brand-text">
                    {formatCurrency(totalDistribution)}
                  </p>
                  <p className="mt-2 text-xs text-brand-muted">{visibleChartData.length} rubros calculados</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm text-brand-muted">
            <p className="font-semibold text-brand-text">Normas y tarifas vigentes</p>
            {result.legalReferences.map((reference) => (
              <a
                key={reference.label}
                className="block underline decoration-dotted"
                href={reference.href}
                rel="noreferrer"
                target="_blank"
              >
                {reference.label}: {reference.detail}
              </a>
            ))}
            <p>Tarifas vigentes {result.metadata.ratesYear}. SMMLV: {formatCurrency(result.metadata.smmlv)}.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}): JSX.Element {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-brand-muted">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="pb-3 pr-4"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, rowIndex) => (
            <tr
              key={`${rowIndex}-${row[0]}`}
              className="text-brand-text"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}-${cell}`}
                  className="py-3 pr-4 align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getArlRate(risk?: CalculatorInput['arlRisk']): number {
  const rates = {
    RIESGO_I: CURRENT_LEGAL_RATES.ARL_RIESGO_I,
    RIESGO_II: CURRENT_LEGAL_RATES.ARL_RIESGO_II,
    RIESGO_III: CURRENT_LEGAL_RATES.ARL_RIESGO_III,
    RIESGO_IV: CURRENT_LEGAL_RATES.ARL_RIESGO_IV,
    RIESGO_V: CURRENT_LEGAL_RATES.ARL_RIESGO_V,
  };

  return risk ? rates[risk] : CURRENT_LEGAL_RATES.ARL_RIESGO_I;
}

function humanizeContract(contractType?: CalculatorInput['contractType']): string {
  const labels = {
    TERMINO_FIJO: 'Termino fijo',
    TERMINO_INDEFINIDO: 'Termino indefinido',
    OBRA_LABOR: 'Obra o labor',
    MEDIO_TIEMPO: 'Medio tiempo',
  };

  return contractType ? labels[contractType] : 'Prestacion de servicios';
}
