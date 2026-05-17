# Pago Justo

Aplicación React 18 + Vite + TypeScript para calcular seguridad social, parafiscales y prestaciones sociales en Colombia.

## Scripts

- `npm run dev`: inicia Vite en desarrollo.
- `npm run build`: valida TypeScript y genera build de producción.
- `npm run test`: ejecuta Vitest con cobertura.
- `npm run lint`: ejecuta ESLint.

## Arquitectura

La app usa una arquitectura feature-based:

- `src/core`: motor puro de cálculo, UI reutilizable y utilidades compartidas.
- `src/features`: dominios funcionales como calculadora, historial, exportación y landing.
- `src/pages`: wrappers delgados para rutas.
- `src/app`: router, providers globales y composición raíz.

## Alcance implementado

- Wizard accesible de 4 pasos con estado en query params.
- Motor puro de cálculo con tasas centralizadas y validaciones laborales.
- Dashboard de resultados con cards, desglose, gráfica y panel legal.
- Historial en `localStorage`, exportación PDF, CSV y enlace compartible.
- Comparador de escenarios, simulador de aumento salarial y liquidación final.
- Service worker básico para modo offline.
