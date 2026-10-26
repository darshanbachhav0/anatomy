# Laboratorio de ecocardiografía UMA

La pestaña **Ecocardiografía** carga `public/echo/index.html` sin reemplazar las vistas existentes. Los recursos se sirven localmente, sin iframe externo ni dependencia en tiempo de ejecución del sitio de referencia. El motor utiliza WebGL; las secuencias clínicas requieren reproducción de MP4.

## Mantenimiento

- `scripts/import-echo.mjs`: importa los recursos públicos autorizados. No sobrescribe archivos existentes. La estructura y los hashes pertenecen a la instantánea de octubre de 2026; revisar el manifiesto si cambia el sitio original.
- `scripts/prepare-echo.mjs`: aplica rutas, metadatos, privacidad y búsqueda española. Es idempotente.
- `scripts/translate-echo.mjs`: genera el diccionario a partir de textos públicos usando un servicio externo. No se ejecuta durante la compilación ni en el navegador. El diccionario está incluido en el repositorio; no hace falta acceso a traducción para utilizar el módulo.
- `public/echo/uma-es.js`: correcciones terminológicas y localización reactiva. Conserva IDs, valores de opciones y ecuaciones del motor.
- `public/echo/uma.css`: colores e identidad institucional. No modifica los colores anatómicos ni las escalas clínicas.
- `public/echo/ADAPTACION-UMA.md`: procedencia, autorización comunicada por el usuario y atribuciones obligatorias.

## Comprobaciones

```sh
npm run prepare:echo
npm run test:echo
npx tsc --noEmit
npm run build
```

Las pruebas verifican idempotencia de traducción, descripciones dinámicas, rutas, atribuciones, 15 vistas, 15 vídeos, volúmenes y búsqueda localizada. La comprobación visual cubre el modelo anatómico, modo práctica, rotación/profundidad, búsqueda española y cálculo de superficie corporal (170 cm, 70 kg: 1,82 m²). Esto no constituye validación clínica de las 70 calculadoras; se requiere revisión docente del contenido y la traducción.

REA se ejecutó sobre los módulos públicos descargados con `npx --yes rea-agents analyze-javascript-application ... --json`. Los informes locales están en `outputs/echo-rea-analysis.json` y `outputs/echo-import.json`; no son dependencias de producción.
