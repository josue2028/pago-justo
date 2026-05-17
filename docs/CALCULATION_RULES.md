# Reglas de calculo

## Objetivo

Este documento resume como el proyecto calcula los valores laborales principales y donde vive cada regla dentro del codigo.

## Fuente principal

Las tarifas y referencias legales estan centralizadas en:

`src/domain/calculator/constants/colombiaRates.ts`

## Tipos de flujo soportados

### Empleado dependiente

Incluye:

- salario base
- seguridad social compartida
- parafiscales
- prestaciones sociales
- costo total empleador
- neto a pagar

### Contratista independiente

Incluye:

- ingreso bruto
- IBC del independiente
- salud y pension del independiente
- ARL cuando corresponda
- valor neto del contratista

No incluye:

- prestaciones sociales
- parafiscales laborales clasicos

## Orquestador principal

La funcion `calculateAll(input)` realiza:

1. Validacion del input.
2. Calculo de dias del periodo.
3. Proporcion del periodo liquidado.
4. Calculo de seguridad social.
5. Calculo de parafiscales.
6. Calculo de prestaciones.
7. Construccion del resumen final.

## Seguridad social

Archivo:

`src/domain/calculator/calculators/socialSecurity.ts`

Conceptos considerados:

- salud
- pension
- ARL

Para empleados:

- salud trabajador: 4%
- salud empleador: 8.5%
- pension trabajador: 4%
- pension empleador: 12%
- ARL segun nivel de riesgo

Para independientes:

- salud y pension sobre el IBC
- IBC base del 40% del ingreso
- ARL segun riesgo cuando aplique en la implementacion

## Parafiscales

Archivo:

`src/domain/calculator/calculators/parafiscales.ts`

Conceptos:

- caja de compensacion
- ICBF
- SENA

El calculo considera condiciones de aplicacion y exencion configuradas por reglas y parametros.

## Prestaciones sociales

Archivo:

`src/domain/calculator/calculators/benefits.ts`

Conceptos:

- prima
- cesantias
- intereses sobre cesantias
- vacaciones

Observaciones:

- para empleados se calculan segun base y dias trabajados
- para contratistas se devuelven en cero

## Liquidacion final

Archivo:

`src/domain/calculator/calculators/index.ts`

La funcion `calculateFinalSettlement` contempla:

- prestaciones pendientes
- salario pendiente
- auxilio pendiente
- indemnizacion cuando aplica

Escenarios:

- termino indefinido
- termino fijo
- obra o labor
- medio tiempo

## Comparador de escenarios

La funcion `compareScenarios` permite comparar dos configuraciones de entrada y devuelve diferencias en:

- costo empleador
- neto empleado
- seguridad social
- prestaciones

## Simulador de aumento salarial

La funcion `calculateSalaryIncrease` recalcula el escenario con un porcentaje de aumento y entrega:

- escenario actual
- escenario proyectado
- porcentaje aplicado

## Reglas de mantenimiento

Cuando cambie normativa:

1. Actualizar `colombiaRates.ts`.
2. Revisar validaciones en `laboralRules.ts`.
3. Ajustar pruebas del dominio.
4. Validar resultados de UI y PDF.

## Validacion recomendada despues de cambios normativos

```bash
npm run test
npm run build
```
