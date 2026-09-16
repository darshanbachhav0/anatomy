# Fuentes, licencias y alcance del atlas UMA

## Datos anatómicos

La geometría procede de **BodyParts3D 4.0**, del Database Center for Life Science,
con licencia **Creative Commons Atribución 4.0 Internacional (CC BY 4.0)**.

- [Base de datos y descarga](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html)
- [Licencia de la base de datos](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html)
- [Condiciones de CC BY 4.0 en español](https://creativecommons.org/licenses/by/4.0/deed.es)

Aviso de atribución original: BodyParts3D, © The Database Center for Life Science
licensed under CC Attribution 4.0 International.

La referencia corresponde a anatomía adulta masculina. Contiene 2.234 mallas
individuales y 3.432 conceptos anatómicos. Un concepto puede agrupar varias piezas.
No representa todas las estructuras ni las variaciones anatómicas de cada persona.

## Visor e integración

El visor adapta [Human Atlas](https://github.com/ashemag/human-atlas), revisión
`1c38bf35c254a891200d3cedecfd57abebe83d8d`, cuyo código utiliza la licencia MIT.
Se conserva el [texto original de la licencia](./LICENSE.txt).

Las adaptaciones originales de la geometría incluyen conversión de ejes y unidades,
simplificación, compresión y agrupación para su uso en navegadores. La integración
UMA conserva esa geometría y añade su identidad visual, controles de ocultamiento
y restauración, historial de acciones y un área de estudio del corazón.

Se corrigieron agrupaciones del catálogo: los ventrículos cerebrales pertenecen
al sistema nervioso; los músculos papilares del corazón, al grupo cardíaco; la
válvula mitral contiene sus dos valvas modeladas, y la pared ventricular se incluye
en el conjunto del corazón. Los identificadores FMA/FJ se mantienen.

## Traducción al español

Los 3.432 nombres únicos del catálogo cuentan con etiquetas en español guardadas
localmente. La traducción utiliza equivalencias terminológicas y reglas explícitas
de composición, género, lateralidad y numeración. La búsqueda admite términos como
peroné/fíbula, cúbito/ulna, escápula/omóplato y giro/circunvolución.

Los nombres originales se conservan en los datos de referencia y como términos
de búsqueda, pero no se muestran como etiquetas de las estructuras. No se envían
apuntes ni datos de estudiantes a un servicio de traducción. No se requiere conexión
con un traductor externo para utilizar la plataforma.

La cobertura de traducción se verifica automáticamente. Esto no equivale a una
validación médica: se recomienda la revisión docente de la terminología antes
de utilizarla en evaluaciones formales.

## Uso educativo

Las cavidades son volúmenes de referencia, no tejido sólido. Ocultar paredes no
simula incisiones, deformación de tejidos ni procedimientos quirúrgicos. El atlas
es un apoyo al aprendizaje, no una herramienta de diagnóstico o tratamiento.

[Atribución original completa y antecedentes del conjunto de datos](./ATTRIBUTION.md)
