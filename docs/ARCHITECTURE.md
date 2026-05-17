# Arquitectura

## Vision general

Pago Justo esta estructurado como una aplicacion SPA con una capa de dominio separada de la interfaz. Aunque no existe un backend dedicado dentro del repositorio, la organizacion actual ya divide claramente:

- composicion de app
- modulos funcionales
- dominio del negocio
- utilidades compartidas

Esto permite evolucionar el producto sin acoplar la UI con las formulas laborales.

## Capas

### `src/app`

Responsabilidad:

- bootstrap de React
- router
- providers globales
- boundaries y composicion de alto nivel

Archivos clave:

- `App.tsx`
- `Router.tsx`
- `ErrorBoundary.tsx`
- `routes/*`
- `providers/*`

### `src/modules`

Responsabilidad:

- experiencia visible al usuario
- componentes de negocio
- stores y hooks de modulo
- formularios, dashboards y simuladores

Regla:

Un modulo puede consumir `shared` y `domain`, pero no debe duplicar reglas del negocio.

### `src/domain`

Responsabilidad:

- reglas puras de calculo
- formulas
- constantes legales
- validaciones
- tipos del dominio

Regla:

No debe depender de React ni de UI.

### `src/shared`

Responsabilidad:

- componentes reutilizables
- utilidades transversales
- helpers de formato y validacion general

## Flujo de dependencias

Direccion recomendada:

```text
app -> modules -> domain
app -> modules -> shared
modules -> shared
modules -> domain
domain -> sin dependencias de UI
shared -> sin dependencias de negocio especifico
```

## Razon de la estructura

Esta estructura se eligio para resolver tres problemas comunes:

1. Evitar que los calculos queden enterrados dentro de componentes React.
2. Permitir que la UI cambie sin romper formulas.
3. Preparar el proyecto para una futura separacion frontend/backend.

## Como escalar a backend sin rehacer todo

Si en el futuro se crea una API:

- `domain/calculator` puede migrarse a servicios del backend.
- `modules/calculator` puede pasar a consumir endpoints.
- `shared/lib` puede mantener solo helpers de cliente.
- las tarifas pueden moverse a una base de datos o a una capa de configuracion.

## Alias recomendados

El proyecto usa aliases para mejorar legibilidad:

- `@app/*`
- `@modules/*`
- `@domain/*`
- `@shared/*`

Tambien se mantuvieron algunos aliases legacy por compatibilidad:

- `@core/*`
- `@features/*`

## Buenas practicas para futuras contribuciones

- No meter logica de negocio nueva en componentes si pertenece al dominio.
- No duplicar tarifas en varios archivos.
- No conectar componentes directamente a implementaciones muy internas si ya existe un `index.ts` publico del modulo.
- Mantener pruebas del dominio separadas de pruebas de UI.
- Si una nueva funcionalidad es visible al usuario, debe vivir en `modules`.
- Si una nueva funcionalidad es una regla, formula o validacion, debe vivir en `domain`.
