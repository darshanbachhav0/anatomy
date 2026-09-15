# Atlas corporal UMA

Se agregó **Atlas 3D** a la navegación de escritorio y móvil, sin reemplazar
el visor de órganos ni los datos del estudiante.

## Uso local

Con Node.js 22.13 o posterior y las dependencias instaladas:

```powershell
npm run dev -- --port 3001
```

Abrir `http://localhost:3001` y seleccionar **Atlas 3D**. Si ese servidor ya está
ejecutándose, basta con actualizar la página; no hace falta iniciar otro.

## Funciones

- 2.234 piezas seleccionables y 3.432 conceptos anatómicos.
- Quince capas; pulsar un nombre muestra solo ese sistema y el ojo combina capas.
- Presets Todas, Esqueleto y Órganos, y ocultamiento de todas las capas.
- Búsqueda por nombre en español, original en inglés e identificador FMA/FJ.
- Selección directa, ficha de estructura, listado de piezas, aislamiento y centrado.
- Vistas frontal, lateral, posterior y tres cuartos; zoom y giro automático.
- Despiece progresivo: ensamblado, separación por sistemas e inventario de piezas.
  El inventario final usa vista frontal y permite desplazamiento.
- Ocultar/restaurar piezas, deshacer/rehacer y restablecer el área de estudio.
- Área **Corazón por piezas**, con 84 piezas; **Ver interior** oculta paredes
  y volúmenes de cavidad para explorar las estructuras que quedan.
- Enlace al corazón multipartes desde el panel de disección del visor anterior.
- Herramientas WebMCP opcionales para búsqueda e inspección en navegadores compatibles.

Los órganos originales, comparación, puntos de interés, lecciones, cuestionarios,
fichas, biblioteca, apuntes, favoritos, progreso y ajustes conservan sus módulos
y almacenamiento existentes. No se modifican claves ni se migran datos del estudiante.

## Integración técnica

`app/components/atlas/FullBodyAtlas.tsx` y el visor Three.js se cargan bajo demanda.
La primera visita al atlas descarga aproximadamente 33 MB de geometría comprimida.
Se conservan los binarios sin comprimir para navegadores sin `DecompressionStream`.
No se necesitan cuentas, claves API, servicios de traducción ni Blender para usar
estas piezas.

Las geometrías se agrupan por sistema dentro de 15 bloques. Texturas de estado en la
GPU controlan visibilidad, selección y desplazamiento por pieza, y mallas individuales
permiten la selección precisa. La selección táctil distingue toque, arrastre y pellizco.
La salida del módulo cancela descargas y libera recursos del visor.

Todos los archivos se sirven desde `public/atlas/`; no hay dependencias de red con
GitHub o BodyParts3D durante el uso. No se añadieron paquetes de ejecución.

## Fuente y reproducción

Fuente: https://github.com/ashemag/human-atlas

Revisión integrada: `1c38bf35c254a891200d3cedecfd57abebe83d8d`.

El código adaptado conserva la licencia MIT en `public/atlas/LICENSE.txt`.
Los datos BodyParts3D mantienen su atribución CC BY 4.0 y las modificaciones
están documentadas en `public/atlas/ATTRIBUTION.md`, accesible desde la interfaz.

La copia de referencia `.atlas-reference` se excluye de Git, TypeScript y ESLint.
Para reimportar esta misma revisión (no ejecutar sobre una actualización sin revisarla):

```powershell
npm run import:atlas -- .atlas-reference
```

El script copia los bloques, cambia las rutas y aplica correcciones de agrupación:
ventrículos cerebrales al sistema nervioso, músculos papilares al cardíaco,
solo dos valvas mitrales e inclusión de la pared ventricular en el grupo del corazón.

## Comprobaciones

```powershell
npx tsc --noEmit
npm run lint
npm test
```

`npm run test:atlas` ejecuta solo las nueve pruebas del nuevo módulo. Cubren todos
los binarios, descompresión, índices, límites, jerarquía, búsqueda, visibilidad,
historial, despiece sin solapamiento, gestos y herramientas opcionales.
Las cuatro pruebas originales también se mantienen.

Si el entorno bloquea subprocesos del ejecutor de pruebas, ejecutar directamente
`node tests/atlas.test.mjs` y, después de compilar, `node tests/rendered-html.test.mjs`.

Se validaron compilación, tipos, lint, pruebas automatizadas y entrega HTTP local.
No se realizó una prueba visual en navegador ni en dispositivos táctiles físicos.

## Límites del recurso

- Referencia adulta masculina; no representa todas las estructuras ni variaciones.
- Interfaz en español y traducciones curadas para órganos y estructuras comunes.
  Los términos especializados aún no traducidos conservan el original, identificado
  en la ficha; siguen siendo buscables mediante inglés o identificadores.
- Las cavidades son volúmenes de referencia, no tejido. Ocultar paredes no produce
  cortes, deformaciones ni una simulación quirúrgica.
- Las descripciones genéricas se identifican como contexto del sistema.
- Requiere WebGL y memoria suficiente para geometría anatómica completa. Los errores
  de carga y pérdida de contexto muestran la opción de reintentar.
- Uso educativo complementario; no se ha realizado validación clínica.

## Publicación

Se conserva `.openai/hosting.json` sin cambios. El conector Sites devolvió
«Sites project not found» para el proyecto existente durante esta integración;
no se creó otro sitio ni se publicó una versión. El cambio está disponible localmente.
