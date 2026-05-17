export const CURRENT_LEGAL_RATES = {
  EFFECTIVE_YEAR: 2026,
  EFFECTIVE_FROM: '2026-01-01',
  SALUD_EMPLEADO: 0.04,
  PENSION_EMPLEADO: 0.04,
  SALUD_EMPLEADOR: 0.085,
  PENSION_EMPLEADOR: 0.12,
  ARL_RIESGO_I: 0.00522,
  ARL_RIESGO_II: 0.01044,
  ARL_RIESGO_III: 0.02436,
  ARL_RIESGO_IV: 0.0435,
  ARL_RIESGO_V: 0.0696,
  CAJA_COMPENSACION: 0.04,
  ICBF: 0.03,
  SENA: 0.02,
  PRIMA: 1 / 12,
  CESANTIAS: 1 / 12,
  INT_CESANTIAS: 0.12,
  VACACIONES: 15 / 360,
  SMMLV: 1750905,
  AUXILIO_TRANSPORTE: 249095,
  IBC_INDEPENDIENTE_PORCENTAJE: 0.4,
  IBC_MINIMO_SALUD: 1,
  IBC_MINIMO_MEDIO_TIEMPO: 0.5,
  IBC_MAXIMO: 25,
} as const;

export const LEGAL_REFERENCES = [
  {
    label: 'Decreto 1469 de 2025',
    detail: 'Fija el salario mínimo legal mensual vigente para 2026 en $1.750.905.',
    href: 'https://www.suin-juriscol.gov.co/viewDocument.asp?id=30055940',
  },
  {
    label: 'Decreto 1470 de 2025',
    detail: 'Fija el auxilio de transporte 2026 en $249.095 para quienes devengan hasta 2 SMMLV.',
    href: 'https://www.suin-juriscol.gov.co/clp/contenidos.dll/Decretos/30055941',
  },
  {
    label: 'Ministerio de Salud',
    detail: 'Confirma cotización en salud del 12,5%: 8,5% empleador y 4% trabajador.',
    href: 'https://minsalud.gov.co/proteccionsocial/Regimensubsidiado/Paginas/aseguramiento-al-sistema-general-salud.aspx',
  },
  {
    label: 'Colpensiones',
    detail: 'Confirma cotización a pensión del 16% y el 40% del ingreso para independientes.',
    href: 'https://www.colpensiones.gov.co/educacion/publicaciones/2849/como-aportar-a-pension/',
  },
  {
    label: 'Ley 1780 de 2016',
    detail: 'Exención en caja de compensación para nuevo personal entre 18 y 28 años, bajo condiciones legales.',
    href: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=69573',
  },
  {
    label: 'Código Sustantivo del Trabajo',
    detail: 'Regula prima, cesantías, vacaciones, liquidación final e indemnizaciones.',
    href: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=33104',
  },
] as const;
