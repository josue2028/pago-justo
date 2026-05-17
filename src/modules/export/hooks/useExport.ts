import { jsPDF } from 'jspdf';
import { formatCurrency, formatDateRange, formatPercentage } from '@core/utils/formatters';
import type { CalculatorInput, CalculatorResult } from '@core/engine/types/calculator.types';

const CHART_COLORS = ['#1E6FD9', '#F4A62A', '#22C55E', '#0F172A', '#94A3B8'];

export function useExport() {
  const exportToPdf = async (result: CalculatorResult, input?: Partial<CalculatorInput>): Promise<void> => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const isIndependent = input?.role === 'CONTRATISTA_INDEPENDIENTE';
    const periodLabel =
      input?.startDate && input?.endDate
        ? formatDateRange(input.startDate, input.endDate)
        : `Tarifas ${result.metadata.ratesYear}`;
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

    pdf.setFillColor(15, 23, 42);
    pdf.roundedRect(0, 0, pageWidth, 62, 0, 0, 'F');
    pdf.setFillColor(30, 111, 217);
    pdf.circle(pageWidth - 28, 18, 16, 'F');
    pdf.setFillColor(244, 166, 42);
    pdf.circle(pageWidth - 12, 32, 10, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text('Pago Justo', margin, 20);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Reporte profesional de liquidacion laboral', margin, 28);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Calculado con Pago Justo', margin, 36);

    pdf.setFont('helvetica', 'normal');
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, 46, contentWidth, 20, 4, 4, 'FD');
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(10);
    pdf.text(`Periodo: ${periodLabel}`, margin + 4, 54);
    pdf.text(`Dias liquidados: ${result.metadata.workingDays}`, margin + 4, 60);
    pdf.text(`SMMLV: ${formatCurrency(result.metadata.smmlv)}`, pageWidth - margin - 52, 54);
    pdf.text(`Rol: ${isIndependent ? 'Contratista' : 'Empleado'}`, pageWidth - margin - 52, 60);

    const summaryCards = [
      {
        label: isIndependent ? 'Valor del contrato' : 'Costo total empleador',
        value: formatCurrency(result.summary.employerCost),
        color: [30, 111, 217] as const,
      },
      {
        label: isIndependent ? 'Neto contratista' : 'Neto a pagar',
        value: formatCurrency(result.summary.employeeNet),
        color: [34, 197, 94] as const,
      },
      {
        label: 'Seguridad social',
        value: formatCurrency(result.summary.totalSocialSecurity),
        color: [244, 166, 42] as const,
      },
    ];

    let y = 78;
    const cardGap = 6;
    const cardWidth = (contentWidth - cardGap * 2) / 3;
    summaryCards.forEach((card, index) => {
      const x = margin + index * (cardWidth + cardGap);
      pdf.setFillColor(card.color[0], card.color[1], card.color[2]);
      pdf.roundedRect(x, y, cardWidth, 26, 4, 4, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(card.label, x + 4, y + 8);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.text(card.value, x + 4, y + 18);
    });

    y += 38;

    const chartImage = createDonutChartImage(chartData);
    const chartBlockHeight = 58;
    pdf.setDrawColor(226, 232, 240);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, y, contentWidth, chartBlockHeight, 4, 4, 'FD');
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Distribucion del calculo', margin + 4, y + 8);
    pdf.addImage(chartImage, 'PNG', margin + 4, y + 12, 42, 42);

    let legendY = y + 18;
    chartData.forEach((entry, index) => {
      pdf.setFillColor(hexToRgb(CHART_COLORS[index])[0], hexToRgb(CHART_COLORS[index])[1], hexToRgb(CHART_COLORS[index])[2]);
      pdf.circle(margin + 56, legendY - 1.5, 1.5, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(entry.name, margin + 60, legendY);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatCurrency(entry.value), pageWidth - margin - 4, legendY, { align: 'right' });
      legendY += 8;
    });

    y += chartBlockHeight + 8;

    const sections = [
      {
        title: 'Resumen ejecutivo',
        rows: [
          ['Prestaciones del periodo', formatCurrency(result.summary.totalBenefits)],
          ['Parafiscales', formatCurrency(result.summary.totalParafiscales)],
          ['IBC seguridad social', formatCurrency(result.socialSecurity.ibc)],
        ],
      },
      {
        title: 'Seguridad social',
        rows: [
          ['Salud empleador', formatCurrency(result.socialSecurity.saludEmpleador)],
          ['Pension empleador', formatCurrency(result.socialSecurity.pensionEmpleador)],
          [
            `Pension ${isIndependent ? 'contratista' : 'trabajador'} (${formatPercentage(result.socialSecurity.pensionEmpleadoRate)})`,
            formatCurrency(result.socialSecurity.pensionEmpleado),
          ],
          ['ARL total', formatCurrency(result.socialSecurity.arlTotal)],
        ],
      },
    ];

    sections.forEach((section) => {
      pdf.setDrawColor(226, 232, 240);
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, y, contentWidth, 12 + section.rows.length * 10, 4, 4, 'FD');
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(section.title, margin + 4, y + 8);

      let rowY = y + 16;
      section.rows.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(label, margin + 4, rowY);
        pdf.setFont('helvetica', 'bold');
        pdf.text(value, pageWidth - margin - 4, rowY, { align: 'right' });
        rowY += 9;
      });

      y += 20 + section.rows.length * 10;
    });

    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    pdf.text('Calculado con Pago Justo', margin, pageHeight - 10);
    pdf.text(`Generado ${new Date().toLocaleDateString('es-CO')}`, pageWidth - margin, pageHeight - 10, {
      align: 'right',
    });

    pdf.save('pago-justo-reporte.pdf');
  };

  const copySummary = async (result: CalculatorResult): Promise<void> => {
    const summary = [
      `Costo empleador: ${formatCurrency(result.summary.employerCost)}`,
      `Neto empleado: ${formatCurrency(result.summary.employeeNet)}`,
      `Prestaciones: ${formatCurrency(result.summary.totalBenefits)}`,
    ].join('\n');

    await navigator.clipboard.writeText(summary);
  };

  return {
    exportToPdf,
    copySummary,
  };
}

function createDonutChartImage(data: Array<{ name: string; value: number }>): string {
  const canvas = document.createElement('canvas');
  const size = 320;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = size * ratio;
  canvas.height = size * ratio;

  const context = canvas.getContext('2d');
  if (!context) {
    return '';
  }

  context.scale(ratio, ratio);
  context.clearRect(0, 0, size, size);

  const center = size / 2;
  const radius = 96;
  const innerRadius = 58;
  const total = data.reduce((sum, entry) => sum + entry.value, 0) || 1;
  let angle = -Math.PI / 2;

  data.forEach((entry, index) => {
    const segment = (entry.value / total) * Math.PI * 2;
    context.beginPath();
    context.moveTo(center, center);
    context.fillStyle = CHART_COLORS[index];
    context.arc(center, center, radius, angle, angle + segment);
    context.closePath();
    context.fill();
    angle += segment;
  });

  context.beginPath();
  context.fillStyle = '#ffffff';
  context.arc(center, center, innerRadius, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#64748b';
  context.font = '600 16px Helvetica';
  context.textAlign = 'center';
  context.fillText('Total', center, center - 8);
  context.fillStyle = '#0f172a';
  context.font = '700 18px Helvetica';
  context.fillText(formatCompactCurrency(total), center, center + 18);

  return canvas.toDataURL('image/png');
}

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
