# Laboratorio de ecocardiografía UMA

La pestaña **Ecocardiografía** carga `public/echo/index.html` sin reemplazar las vistas existentes. Los recursos se sirven localmente, sin iframe externo ni dependencia en tiempo de ejecución del sitio de referencia. El motor utiliza WebGL; las secuencias clínicas requieren reproducción de MP4.

## Mantenimiento

- `public/echo/atlas-anatomy.js`: reutiliza el catálogo y los buffers de Exploración en `/atlas/models/`. Registra el atlas mediante la envolvente ventricular y una escala uniforme; limita las estructuras al tramo corporal del simulador. No genera copias de modelos en disco.
- El cargador `lab-QITkds_9.js` aplica el adaptador antes de iniciar la escena; `main-jy7ggAZV.js` utiliza `displayMeshes` solamente para dibujar. `meshes` y los bytes originales se conservan para el escaneo y sus etiquetas; corazón, piel, hígado, poses y volúmenes no cambian. Se comprueba la integridad original antes de adaptar y se calcula el hash del buffer resultante.
- Se retiró el antiguo diálogo «Acerca del simulador UMA» de ambas páginas. Los botones existentes de créditos de las calculadoras abren ahora un diálogo independiente mediante `credits.js`; no cambia su aspecto ni las fórmulas. `credits.html` ofrece las mismas fuentes sin JavaScript y es accesible desde el enlace general de licencias. Se conservan todos los créditos individuales de figuras y vídeos. Las atribuciones originales permanecen en `assets/ATTRIBUTION.txt`, `assets/credits.json` y `ADAPTACION-UMA.md`; el atlas compartido conserva `/atlas/ATRIBUCION.md` y `/atlas/LICENSE.txt`.

- `scripts/import-echo.mjs`: importa los recursos públicos autorizados. No sobrescribe archivos existentes. La estructura y los hashes pertenecen a la instantánea de octubre de 2026; revisar el manifiesto si cambia el sitio original.
- `scripts/prepare-echo.mjs`: aplica rutas, metadatos, privacidad y búsqueda española. Es idempotente.
- `scripts/translate-echo.mjs`: genera el diccionario a partir de textos públicos usando un servicio externo. No se ejecuta durante la compilación ni en el navegador. El diccionario está incluido en el repositorio; no hace falta acceso a traducción para utilizar el módulo.
- `public/echo/uma-es.js`: correcciones terminológicas y localización reactiva. Conserva IDs, valores de opciones y ecuaciones del motor.
- Las instrucciones de práctica se traducen también cuando el motor combina un verbo con una dirección o una posición del reloj. `tests/echo-guidance.test.mjs` obtiene los generadores del módulo activo del laboratorio y comprueba las ocho direcciones, los giros horarios/antihorarios en las 24 posiciones, la profundidad y los mensajes de estado. Así se cubren las frases que no existen como una cadena completa en el código.
- `public/echo/spanish-overrides.json`: traducciones adicionales de los textos detectados al recorrer las 70 calculadoras, sus ayudas y los créditos. Corrige términos como deformación, tiempo de hemipresión y referencias a variables de fórmulas. El mantenimiento de traducciones conserva estas entradas; no se consulta ningún servicio de traducción durante el uso de la plataforma. Las cifras y las instrucciones accesibles de los segmentos se comprueban en las pruebas de ecocardiografía.
- `public/echo/spanish-templates.json`: plantillas para resultados, validaciones e instrucciones con cifras o nombres variables. `uma-es.js` conserva los valores interpolados y traduce también las listas de mediciones, los avisos de rangos y las ayudas accesibles. Las pruebas comprueban todos los marcadores de posición, las constantes numéricas y la estabilidad de la traducción al aplicarse de nuevo.
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
