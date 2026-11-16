# Anatomía compartida del atlas UMA

El catálogo y la geometría de `public/atlas/models/` se conservan como recursos
compartidos del módulo de ecocardiografía. `public/echo/atlas-anatomy.js` utiliza
estos datos para añadir huesos y vasos al entorno del simulador, manteniendo la
anatomía original empleada para el escaneo.

El antiguo visor React independiente dejó de formar parte de la navegación y
se retiró durante la limpieza del proyecto. Las pestañas **Exploración** y
**Movimientos** utilizan el visor activo de `public/study-atlas/`.

## Recursos conservados

- Catálogo con 2.234 piezas y 3.432 conceptos anatómicos.
- Quince bloques de geometría en versiones binarias y comprimidas con gzip.
- Identificadores, relaciones y límites utilizados para registrar la anatomía.
- Licencias y atribuciones en `public/atlas/ATRIBUCION.md`, `ATTRIBUTION.md`
  y `LICENSE.txt`.

No eliminar estos recursos al retirar código de interfaz: el simulador de
Ecocardiografía los solicita directamente por HTTP.

## Fuente e importación

Fuente: https://github.com/ashemag/human-atlas

Revisión integrada: `1c38bf35c254a891200d3cedecfd57abebe83d8d`.

La copia local de referencia no es necesaria para ejecutar ni compilar la
aplicación. Para una reimportación revisada, obtener esa revisión por separado
y proporcionar su ruta explícitamente:

```powershell
npm run import:atlas -- C:/ruta/al/human-atlas
```

El importador copia los bloques, adapta las rutas y conserva las correcciones
de agrupación anatómica documentadas. Revisar los cambios antes de reemplazar
los recursos existentes.

## Verificación

```powershell
npm run test:atlas
npm run test:echo
```

Las pruebas del atlas comprueban el catálogo, las relaciones, los límites,
los índices de triángulos y la equivalencia de los bloques binarios y gzip.
Las pruebas de ecocardiografía verifican la integración con el simulador,
incluida la preservación de las mallas de escaneo y las poses originales.

Recurso educativo complementario; no constituye validación clínica.
