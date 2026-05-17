# Despliegue

## Resumen

Pago Justo es una SPA construida con Vite. Su despliegue ideal actual es estatico:

- build de produccion en `dist/`
- hosting estatico
- soporte para rutas del cliente con React Router

## Despliegue con Netlify y GitHub

### Opcion recomendada

Conectar el repositorio de GitHub directamente a Netlify.

### Configuracion base

- Build command: `npm run build`
- Publish directory: `dist`
- Node version recomendada: `20`

## Flujo sugerido

1. Subir el proyecto a GitHub.
2. Entrar a Netlify.
3. Crear un nuevo sitio desde Git.
4. Elegir GitHub como proveedor.
5. Seleccionar el repositorio de Pago Justo.
6. Configurar:

```text
Build command: npm run build
Publish directory: dist
```

7. Lanzar el deploy.

## Rutas SPA

Como el proyecto usa `react-router-dom`, puede requerirse redireccion de todas las rutas al `index.html` cuando el hosting intente resolverlas en servidor.

En Netlify, la forma habitual es agregar un archivo:

`public/_redirects`

Con este contenido:

```text
/*    /index.html   200
```

Si actualmente la app te funciona bien en Netlify sin este archivo, puedes dejarlo pendiente. Pero es recomendable si vas a usar rutas internas como:

- `/calculadora`
- `/resultados`

## Service worker

El proyecto registra un service worker basico desde `src/main.tsx` y el archivo vive en:

`public/sw.js`

Ese service worker hace cache minima de:

- `/`
- `/index.html`

Si mas adelante quieres un PWA mas robusto, habra que reemplazar esta implementacion por una estrategia mas completa de cache y versionado.

## Despliegue manual

Tambien puedes desplegar manualmente el build generado:

```bash
npm install
npm run build
```

Luego subir la carpeta `dist/` a cualquier hosting estatico compatible.

## Verificacion posterior al deploy

Checklist recomendada:

- la home carga correctamente
- la ruta `/calculadora` abre sin errores
- la ruta `/resultados` no rompe al recargar
- el PDF se genera
- el grafico y tablas se ven bien en movil
- el service worker no bloquea actualizaciones del sitio

## Problemas comunes

### 1. Error 404 al recargar una ruta

Causa:

- faltan redirects de SPA

Solucion:

- agregar `public/_redirects`

### 2. El deploy falla en build

Revisar:

- version de Node
- lockfile
- errores de TypeScript
- imports rotos

### 3. Cambios no se reflejan

Posibles causas:

- cache del navegador
- service worker entregando archivos anteriores

Solucion:

- limpiar cache
- invalidar o versionar el service worker

## Recomendaciones futuras

- agregar `netlify.toml` si quieres dejar todo configurado dentro del repo
- agregar `_redirects` para blindar rutas SPA
- versionar el service worker cuando el proyecto empiece a cambiar con frecuencia
