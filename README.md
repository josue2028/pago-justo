# Pago Justo

Pago Justo es una aplicacion web construida con React, Vite y TypeScript para realizar calculos laborales colombianos de forma clara, visual y trazable. El sistema centraliza reglas, tarifas y formulas para calcular seguridad social, parafiscales, prestaciones sociales, costo total del empleador, neto del trabajador o contratista, comparaciones de escenarios y simulaciones complementarias.

La aplicacion fue pensada como un producto frontend-first con una capa de dominio fuerte y separada, de modo que la interfaz y la logica de negocio puedan evolucionar juntas en un solo repositorio sin mezclar responsabilidades.

## Tabla de contenido

1. [Resumen funcional](#resumen-funcional)
2. [Objetivos del proyecto](#objetivos-del-proyecto)
3. [Stack tecnologico](#stack-tecnologico)
4. [Arquitectura actual](#arquitectura-actual)
5. [Estructura de carpetas](#estructura-de-carpetas)
6. [Flujo principal de usuario](#flujo-principal-de-usuario)
7. [Modulos implementados](#modulos-implementados)
8. [Motor de calculo](#motor-de-calculo)
9. [Tarifas y referencias legales](#tarifas-y-referencias-legales)
10. [Instalacion local](#instalacion-local)
11. [Scripts disponibles](#scripts-disponibles)
12. [Pruebas y calidad](#pruebas-y-calidad)
13. [Despliegue](#despliegue)
14. [Escalabilidad y siguientes pasos](#escalabilidad-y-siguientes-pasos)
15. [Documentacion adicional](#documentacion-adicional)

## Resumen funcional

La app permite:

- Seleccionar el tipo de vinculacion: empleado dependiente o contratista independiente.
- Seleccionar el tipo de contrato cuando aplica.
- Ingresar variables salariales y del periodo de liquidacion.
- Obtener un dashboard de resultados con:
  - costo total del empleador o valor del contrato
  - neto del empleado o contratista
  - seguridad social
  - parafiscales
  - prestaciones sociales
  - distribucion visual del calculo
  - soporte legal y tarifas vigentes
- Exportar el resultado en PDF.
- Comparar escenarios.
- Simular aumento salarial.
- Simular liquidacion final para contratos laborales.

## Objetivos del proyecto

- Reducir errores de calculo manual en procesos laborales recurrentes.
- Presentar los resultados de forma entendible para usuarios no tecnicos.
- Mantener la logica legal desacoplada de la interfaz.
- Facilitar el crecimiento del proyecto hacia una API o backend formal en el futuro.
- Dejar una base mantenible para nuevas funcionalidades y cambios normativos.

## Stack tecnologico

### Frontend

- `React 18`
- `TypeScript`
- `Vite`
- `React Router DOM`
- `Tailwind CSS`
- `Recharts`
- `React Hook Form`
- `Zod`
- `Zustand`
- `Sonner`
- `jsPDF`

### Testing y calidad

- `Vitest`
- `Testing Library`
- `ESLint`
- `Prettier`

## Arquitectura actual

El proyecto utiliza una arquitectura por capas dentro de un solo repositorio:

- `app`: composicion global, rutas y providers.
- `modules`: funcionalidad visible para usuario agrupada por modulo.
- `domain`: reglas de negocio y calculos puros.
- `shared`: piezas reutilizables de UI y utilidades comunes.

Esta estructura permite que el frontend y la logica de negocio convivan en una sola base sin desordenarse. Si mas adelante se crea una API o backend dedicado, la capa `domain` ya sirve como referencia funcional para migrar casos de uso a servicios.

## Estructura de carpetas

```text
src/
  app/
    App.tsx
    Router.tsx
    ErrorBoundary.tsx
    providers/
    routes/

  domain/
    calculator/
      calculators/
      constants/
      types/
      validators/

  modules/
    calculator/
      components/
      hooks/
      schemas/
      stores/
      index.ts
    export/
      components/
      hooks/
      index.ts
    landing/
      components/
      index.ts

  shared/
    lib/
    ui/

  styles/
  main.tsx

public/
  sw.js

tests/
  components/
  engine/
  setup.ts
```

## Flujo principal de usuario

### 1. Inicio

La ruta `/` presenta la landing del producto y dirige al usuario a la calculadora.

### 2. Wizard de calculo

La ruta `/calculadora` contiene el wizard principal:

1. Tipo de vinculacion
2. Tipo de contrato
3. Datos salariales y de periodo
4. Resultados

El wizard permite continuar por boton, teclado y doble clic en tarjetas de seleccion.

### 3. Resultados

La ruta `/resultados` muestra:

- resumen general
- tablas de desglose
- grafico de distribucion
- referencias legales
- exportacion a PDF

### 4. Simuladores complementarios

Debajo del wizard, cuando ya existe resultado, se activan:

- comparador de escenarios
- simulador de aumento salarial
- simulador de liquidacion final

## Modulos implementados

### `modules/calculator`

Es el modulo principal del producto. Contiene:

- wizard de pasos
- formularios
- selectores de rol y contrato
- dashboard de resultados
- store de calculadora
- comparador de escenarios
- simulador de aumento
- simulador de liquidacion final

### `modules/export`

Contiene la exportacion actual del proyecto:

- panel de acciones posteriores al calculo
- hook de generacion de PDF

### `modules/landing`

Contiene la experiencia de entrada del producto:

- hero section
- mensajes de valor
- acceso rapido a la calculadora

## Motor de calculo

Toda la logica de negocio vive en `src/domain/calculator`.

### Piezas principales

- [index.ts](/d:/JOSUE%20(D)/Desktop/WEB%20PAGO%20JUSTO/src/domain/calculator/calculators/index.ts)
  Orquesta el calculo completo y expone funciones adicionales.
- `benefits.ts`
  Calcula prestaciones sociales.
- `socialSecurity.ts`
  Calcula salud, pension y ARL.
- `parafiscales.ts`
  Calcula caja, ICBF y SENA.
- `laboralRules.ts`
  Contiene reglas de validacion, IBC y metricas del periodo.
- `colombiaRates.ts`
  Centraliza tarifas y referencias normativas.

### Funcion principal

La funcion `calculateAll(input)`:

1. Valida el input.
2. Calcula dias trabajados y proporcion del periodo.
3. Determina base salarial o ingreso bruto segun el rol.
4. Calcula seguridad social.
5. Calcula parafiscales.
6. Calcula prestaciones.
7. Construye un resumen consolidado para UI y exportacion.

### Otras funciones expuestas

- `compareScenarios(base, target)`
- `calculateSalaryIncrease(input, increasePercentage)`
- `calculateFinalSettlement(input)`

## Tarifas y referencias legales

Las tarifas vigentes estan centralizadas en:

[src/domain/calculator/constants/colombiaRates.ts](/d:/JOSUE%20(D)/Desktop/WEB%20PAGO%20JUSTO/src/domain/calculator/constants/colombiaRates.ts)

Actualmente el proyecto trabaja con tarifas configuradas para `2026`, incluyendo:

- SMMLV
- auxilio de transporte
- salud empleado y empleador
- pension empleado y empleador
- ARL por nivel de riesgo
- caja de compensacion
- ICBF
- SENA
- parametros de prestaciones
- porcentaje IBC de independientes

Tambien incluye enlaces normativos que se muestran en resultados.

## Instalacion local

### Requisitos

- Node.js 20 o superior recomendado
- npm 10 o superior recomendado

### Pasos

```bash
npm install
npm run dev
```

La aplicacion quedara disponible normalmente en:

```text
http://localhost:5173
```

## Scripts disponibles

- `npm run dev`
  Inicia el servidor de desarrollo.
- `npm run build`
  Ejecuta TypeScript y genera el build de produccion.
- `npm run preview`
  Sirve localmente el build generado.
- `npm run test`
  Ejecuta la suite de pruebas con cobertura.
- `npm run test:watch`
  Ejecuta pruebas en modo watch.
- `npm run lint`
  Ejecuta ESLint sobre el proyecto.
- `npm run format`
  Formatea archivos con Prettier.

## Pruebas y calidad

La cobertura actual valida principalmente:

- componentes clave del flujo de calculo
- wizard
- resultados
- motor de dominio
- casos normales y bordes

La suite esta ubicada en:

```text
tests/
  components/
  engine/
```

Para correrla:

```bash
npm run test
```

## Despliegue

El proyecto esta listo para desplegar como SPA estatica. El build se genera en `dist/`.

### Build de produccion

```bash
npm run build
```

### Netlify

Si el proyecto se despliega desde GitHub en Netlify:

- Build command: `npm run build`
- Publish directory: `dist`

Como la app usa `react-router-dom`, es recomendable agregar redireccion para SPA si en algun momento aparecen errores de recarga directa en rutas internas.

Consulta la guia detallada en:

[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Escalabilidad y siguientes pasos

La estructura actual ya esta preparada para crecer en varias direcciones:

### 1. Integracion de backend

La carpeta `domain` puede mapearse a:

- servicios de API
- endpoints de calculo
- validaciones server-side
- generacion de reportes desde servidor

### 2. Nuevos modulos

Se pueden agregar facilmente modulos como:

- autenticacion
- panel administrativo
- historial persistente en base de datos
- multiempresa
- exportacion Excel
- versionado de tarifas por anio

### 3. Mejoras de producto

- internacionalizacion
- cache mas robusto
- persistencia en nube
- auditoria de cambios normativos
- integracion con API de normativa o datos parametrizados

## Documentacion adicional

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/CALCULATION_RULES.md](./docs/CALCULATION_RULES.md)
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Estado actual

Estado general del proyecto al momento de esta documentacion:

- arquitectura reorganizada por capas
- build validado
- pruebas automatizadas pasando
- responsive base implementado
- despliegue compatible con Netlify

## Nota de mantenimiento

Cada vez que cambien tarifas o referencias legales, el primer archivo a revisar debe ser:

[src/domain/calculator/constants/colombiaRates.ts](/d:/JOSUE%20(D)/Desktop/WEB%20PAGO%20JUSTO/src/domain/calculator/constants/colombiaRates.ts)

Ese archivo es la fuente principal de verdad para los parametros del calculo.
