# Adaptación de ecocardiografía UMA

Instantánea de la aplicación pública de https://echosuite.app/ obtenida el 22 de octubre de 2026. El usuario confirmó expresamente contar con autorización del autor para adaptar y redistribuir el simulador con la marca UMA. Esa autorización no sustituye las licencias de los recursos de terceros.

Se conservan el motor original, la geometría registrada, las 15 posiciones de sonda, los volúmenes y shaders de ecografía, las 15 secuencias clínicas, las 70 calculadoras y sus figuras educativas. No se ha sustituido la anatomía por geometría aproximada ni el ultrasonido por una animación genérica. REA se utilizó para analizar los módulos JavaScript públicos; no proporciona el código fuente de EchoSuite.

Cambios de esta adaptación: rutas locales bajo `/echo/`, identidad visual UMA, diccionario español, búsqueda de calculadoras en español, eliminación de analítica y del desafío Cloudflare del alojamiento original, y desactivación del registro de service worker para no interferir con la web anfitriona. La aplicación está aislada en un iframe del mismo origen; la pestaña se carga de forma diferida. Las fórmulas, el solucionador geométrico y los datos clínicos no se modifican.

## Créditos y alcance

El software original y las superposiciones educativas son © Mohammed Kamareddine, MD. Conservar `assets/ATTRIBUTION.txt`, `assets/credits.json`, `assets/THREE-LICENSE.txt`, `assets/Michroma-OFL.txt` y las atribuciones individuales de `assets/media/catalog.json`. Incluyen HRA (CC BY 4.0), BodyParts3D (CC BY-SA 2.1 Japan) y las licencias específicas de cada secuencia. Las modificaciones de presentación no transfieren a UMA la autoría de esos recursos.

Módulo educativo, no dispositivo diagnóstico. La traducción combina un diccionario automatizado con correcciones de terminología y controles revisados durante la integración. Requiere revisión docente/clinica antes de utilizarlo en formación evaluada o tomar decisiones asistenciales. Las publicaciones, títulos bibliográficos y nombres propios pueden conservar su idioma original. Las referencias externas siguen abriendo sus fuentes originales.
