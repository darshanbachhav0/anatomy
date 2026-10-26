const phrases = {
  'Skip': 'Omitir',
  'RA size': 'Tamaño de la AD',
  'LA size': 'Tamaño de la AI',
  'RV size': 'Tamaño del VD',
  'LV size': 'Tamaño del VI',
  'Dimensions, area, & volume': 'Dimensiones, área y volumen',
  'Left atrial pressure': 'Presión auricular izquierda',
  'Atria': 'Aurículas',
  'Diastology': 'Función diastólica',
  'Pericardium': 'Pericardio',
  'Physics': 'Física',
  'Shunts': 'Cortocircuitos',
  'Favorites': 'Favoritos',
  'LV linear dimensions': 'Dimensiones lineales del VI',
  'LV volumes': 'Volúmenes del VI',
  'LV ejection fraction': 'Fracción de eyección del VI',
  'RV function & coupling': 'Función y acoplamiento del VD',
  'LA size · volume index': 'Tamaño de la AI · índice de volumen',
  'Left atrial pressure · MR velocity': 'Presión auricular izquierda · velocidad de la IM',
  'LVOT SV & CO': 'TSVI: volumen sistólico y gasto cardíaco',
  'ASD · anatomy, shunt & Doppler': 'CIA · anatomía, cortocircuito y Doppler',
  'VSD · size & right-heart pressure': 'CIV · tamaño y presión derecha',
  'PDA · shunt & PA pressure': 'Conducto arterioso persistente · cortocircuito y presión pulmonar',
  'Coarctation · anatomy & gradients': 'Coartación · anatomía y gradientes',
  'Fontan · circulation & gradients': 'Fontan · circulación y gradientes',
  'How to obtain': 'Cómo obtener',
  'Sources & limitations': 'Fuentes y limitaciones',
  'height': 'estatura',
  'weight': 'peso',
  'RV IN': 'VD ENTRADA',
  'RV OUT': 'VD SALIDA',
  'Previous tutorial step': 'Paso anterior del tutorial',
  'Next tutorial step': 'Siguiente paso del tutorial',
  '3D reference view. Drag or use arrow keys to orbit; plus and minus zoom. Enter Practice to move the probe.': 'Vista 3D de referencia. Arrastra o usa las flechas para orbitar; más y menos para acercar o alejar. Entra en Practicar para mover la sonda.',
  '3D probe practice. Grip slides, blue dashes rotate, black tail tilts and rocks. Background orbits. Use the phone depth strip for depth; larger screens also have fine-control sliders.': 'Práctica 3D. Desliza la empuñadura, gira con las marcas azules e inclina o balancea con el extremo negro. Arrastra el fondo para orbitar. Ajusta la profundidad con la barra; en pantallas grandes también hay controles de precisión.',
  'Slide toward the patient’s left': 'Desliza hacia la izquierda del paciente',
  'Slide toward the patient’s right': 'Desliza hacia la derecha del paciente',
  'Slide toward the head': 'Desliza hacia la cabeza',
  'Slide toward the feet': 'Desliza hacia los pies',
  'Probe Lab':'Laboratorio de ecocardiografía','Calculators':'Calculadoras','Practice':'Practicar','Tour':'Recorrido guiado','Recenter camera':'Centrar cámara','Skin':'Piel','Ribs':'Costillas','Vessels':'Vasos','Liver':'Hígado','Real':'Natural','Glass':'Cristal','Skin opacity':'Opacidad de piel','Bone opacity':'Opacidad de huesos','Target ghost':'Sonda de referencia','Scan plane':'Plano de exploración','Ghost on':'Referencia visible','Ghost off':'Referencia oculta','Next':'Siguiente','Again':'Repetir','Pause Sim':'Pausar simulación','Play Sim':'Reproducir simulación','Preparing Sim…':'Preparando simulación…','Retry':'Reintentar','Try again':'Intentar de nuevo','DEPTH':'PROFUNDIDAD','Depth':'Profundidad','Rotation':'Rotación','Fan':'Inclinación','Rock':'Balanceo','Done':'Listo','About EchoSuite':'Acerca del simulador UMA','Explore echocardiography.':'Explora la ecocardiografía.','Guides & learning':'Guías y aprendizaje','Sources & licences':'Fuentes y licencias','Primary reference':'Referencia principal','Font licence':'Licencia de la tipografía','MIT licence':'Licencia MIT','One probe. Every perspective.':'Una sonda. Todas las perspectivas.','15 reviewed view presets':'15 vistas de referencia revisadas','Opening Probe Lab…':'Abriendo el laboratorio…','Loading the lab…':'Cargando el laboratorio…','Open clinical cine':'Abrir secuencia clínica','Skip to probe lab':'Ir al laboratorio','Close practice':'Salir de la práctica','More probe options':'Más opciones de sonda','Layers':'Capas','Anatomy layers':'Capas anatómicas','Enter fullscreen':'Pantalla completa','Exit fullscreen':'Salir de pantalla completa','Full screen':'Pantalla completa','Exit full screen (Escape)':'Salir de pantalla completa (Escape)','Show anatomy labels':'Mostrar etiquetas anatómicas','Hide anatomy labels':'Ocultar etiquetas anatómicas','Cine source information':'Fuente de la secuencia clínica','Switch to dark mode':'Cambiar a modo oscuro','Switch to light mode':'Cambiar a modo claro','About and sources':'Información y fuentes','About & sources':'Información y fuentes','Close about':'Cerrar información','Recenter Sim':'Restablecer simulación','Restore this view’s probe pose and imaging depth':'Restablecer la posición de la sonda y la profundidad','Imaging depth':'Profundidad de imagen','Anatomy labels':'Etiquetas anatómicas','Echo view family':'Familia de vistas','Echo view':'Vista ecográfica','Standard echo views':'Vistas ecocardiográficas','3D anatomy and probe':'Anatomía 3D y sonda','Echo monitor':'Monitor ecográfico','Workspace':'Espacio de trabajo',
  'Parasternal':'Paraesternal','Apical':'Apical','Subcostal':'Subcostal','Suprasternal':'Supraesternal','APICAL':'APICAL','SUBX':'SUBC','SSN':'SUPRA','Parasternal long axis':'Eje largo paraesternal','RV inflow':'Entrada del VD','RV outflow':'Salida del VD','PSAX aortic valve':'Eje corto: válvula aórtica','PSAX mitral valve':'Eje corto: válvula mitral','PSAX papillary muscles':'Eje corto: músculos papilares','PSAX apex':'Eje corto: ápex','Parasternal short axis, aortic valve level':'Eje corto paraesternal: nivel aórtico','Parasternal short axis, mitral valve level':'Eje corto paraesternal: nivel mitral','Parasternal short axis, papillary muscle level':'Eje corto paraesternal: músculos papilares','Parasternal short axis, apex':'Eje corto paraesternal: ápex','Apical four chamber':'Apical de cuatro cámaras','Apical five chamber':'Apical de cinco cámaras','Apical two chamber':'Apical de dos cámaras','Apical three chamber':'Apical de tres cámaras','Subcostal four chamber':'Subcostal de cuatro cámaras','Inferior vena cava':'Vena cava inferior','Abdominal aorta':'Aorta abdominal','Suprasternal arch':'Arco aórtico supraesternal','Suprasternal notch, aortic arch':'Escotadura supraesternal: arco aórtico',
  'Left ventricle':'Ventrículo izquierdo','Right ventricle':'Ventrículo derecho','Left atrium':'Aurícula izquierda','Right atrium':'Aurícula derecha','Mitral valve':'Válvula mitral','Tricuspid valve':'Válvula tricúspide','Aortic valve':'Válvula aórtica','Pulmonary valve':'Válvula pulmonar','Pulmonary artery':'Arteria pulmonar','Septum':'Tabique','Posterior wall':'Pared posterior','Aorta':'Aorta','LV':'VI','RV':'VD','LA':'AI','RA':'AD','MV':'VM','TV':'VT','AV':'VA','PV':'VP','IVC':'VCI','LVOT':'TSVI','RVOT':'TSVD','IVS':'SIV','IAS':'SIA','LIVER':'HÍGADO','AORTA':'AORTA','ABD AO':'AO ABD',
  'One footprint for all seven parasternal views':'Un punto de apoyo para las siete vistas paraesternales','Same footprint as PLAX, marker rotated 90°':'Mismo apoyo que el eje largo; marcador girado 90°','Apical impulse, near the midaxillary line':'Impulso apical, cerca de la línea axilar media','Below the xiphoid, supine with knees bent':'Bajo el xifoides; decúbito supino con rodillas flexionadas','Jugular notch, neck extended':'Escotadura yugular; cuello extendido',
  'Place the patient left lateral, set the probe beside the sternum, and aim through the LV long axis.':'Coloca al paciente en decúbito lateral izquierdo, apoya la sonda junto al esternón y orienta el haz sobre el eje largo del VI.',
  'Place the probe at the true apical impulse and aim medially toward the base of the heart.':'Coloca la sonda en el impulso apical verdadero y dirige el haz medialmente hacia la base del corazón.',
  'With the patient supine, flatten the probe below the xiphoid and aim toward the left shoulder using the liver as the window.':'Con el paciente en decúbito supino, inclina la sonda bajo el xifoides hacia el hombro izquierdo utilizando el hígado como ventana.',
  'From subcostal four chamber, rotate counterclockwise to a sagittal plane and aim through the liver toward the RA.':'Desde cuatro cámaras subcostal, gira en sentido antihorario hasta el plano sagital y apunta a través del hígado hacia la AD.',
  'Keep the probe sagittal, slide slightly left of midline, and angle posteriorly until the aorta lies over the vertebral body.':'Mantén la sonda sagital, deslízala a la izquierda de la línea media e inclínala posteriormente hasta situar la aorta sobre el cuerpo vertebral.',
  'Extend the neck, place the probe in the notch, and aim toward the plane between the right nipple and left scapular tip.':'Extiende el cuello, coloca la sonda en la escotadura y orienta el haz entre el pezón derecho y la punta de la escápula izquierda.',
  'Rotate about 90° clockwise from PLAX, then tilt superiorly toward the base until the aortic valve is centered.':'Gira unos 90° en sentido horario desde el eje largo e inclina hacia la base hasta centrar la válvula aórtica.',
  'From PSAX aortic level, tilt inferiorly until the mitral leaflets form the fish-mouth appearance.':'Desde el nivel aórtico del eje corto, inclina hacia inferior hasta ver las valvas mitrales con aspecto de boca de pez.',
  'Continue tilting inferiorly toward the apex until both papillary muscles are seen within a circular LV.':'Continúa inclinando hacia el ápex hasta visualizar ambos músculos papilares dentro de un VI circular.',
  'Continue the inferior sweep toward the apex until the papillary muscles disappear and the LV cavity becomes small.':'Continúa el barrido inferior hacia el ápex hasta que desaparezcan los músculos papilares y disminuya la cavidad del VI.',
  'From PLAX, tilt inferiorly toward the patient’s right hip; add slight counterclockwise rotation to center the tricuspid valve.':'Desde el eje largo, inclina hacia la cadera derecha del paciente y gira ligeramente en sentido antihorario para centrar la tricúspide.',
  'From PLAX, tilt anteriorly and rotate slightly clockwise until the RVOT, pulmonary valve, and main PA appear.':'Desde el eje largo, inclina hacia anterior y gira ligeramente en sentido horario hasta ver el TSVD, la válvula pulmonar y la arteria pulmonar.',
  'Keep the A4C contact point and tilt the beam anteriorly until the LVOT and aortic valve enter the center.':'Mantén el apoyo de cuatro cámaras e inclina el haz hacia anterior hasta centrar el TSVI y la válvula aórtica.',
  'From A4C, rotate roughly 60° counterclockwise without sliding off the apex.':'Desde cuatro cámaras, gira unos 60° en sentido antihorario sin abandonar el ápex.',
  'From A2C, rotate roughly another 60° counterclockwise to bring in the LVOT, aortic valve, and aorta.':'Desde dos cámaras, gira otros 60° en sentido antihorario para incluir el TSVI, la válvula aórtica y la aorta.',
  'Slide toward the ring':'Desliza hacia el anillo','Tilt the tail to match the ghost':'Inclina el extremo para coincidir con la referencia','Turn the dashes to match the ghost':'Gira las marcas para coincidir con la referencia','Probe aligned · explore the image':'Sonda alineada · explora la imagen','View acquired — hold it there':'Vista conseguida: mantén la posición','Continue with Next.':'Continúa con Siguiente.','Drag the white grip along the skin.':'Arrastra la empuñadura blanca sobre la piel.','Keep the grip still.':'Mantén fija la empuñadura.','Turn the blue dashes; keep the grip in place.':'Gira las marcas azules sin mover la empuñadura.','Increase depth to include the target anatomy':'Aumenta la profundidad para incluir la anatomía objetivo','Keep the probe still; increase the depth control.':'Mantén la sonda quieta y aumenta la profundidad.','Reduce depth to enlarge the target anatomy':'Reduce la profundidad para ampliar la anatomía','Keep the full view inside the sector.':'Mantén toda la vista dentro del sector.','Fine-tune the tail angle to bring the anatomy into view':'Ajusta el ángulo del extremo para visualizar la anatomía','Depth alone will not recover the plane.':'La profundidad por sí sola no recupera el plano.','Preparing your scan':'Preparando la exploración','Keep the probe here while the current image becomes ready.':'Mantén aquí la sonda mientras se prepara la imagen.','Scan unavailable':'Imagen no disponible','Choose another view, then return.':'Elige otra vista y vuelve a esta.','Hold the probe here':'Mantén la sonda aquí','Move the probe to begin the hunt':'Mueve la sonda para iniciar la búsqueda','Contact, angle and marker are within tolerance.':'Contacto, ángulo y marcador están dentro de la tolerancia.','Then find this view on the Sim.':'Después busca esta vista en el simulador.','Slide the probe':'Desliza la sonda','Turn the marker':'Gira el marcador','Drag the blue dashes around the probe.':'Arrastra las marcas azules alrededor de la sonda.','Steer with the tail':'Orienta con el extremo','Keep the grip still and move the tail to adjust the view.':'Mantén la empuñadura quieta y mueve el extremo para ajustar la vista.','Fine rotation':'Rotación fina','Drag the rotation bar. Right turns clockwise; left anticlockwise.':'Arrastra la barra de rotación: derecha para sentido horario; izquierda para antihorario.','Drag right for a deeper image, left for shallower.':'Arrastra a la derecha para aumentar la profundidad o a la izquierda para reducirla.','Tap the tag icon on the scan to show or hide labels.':'Pulsa el icono de etiquetas para mostrarlas u ocultarlas.','Tap Layers to adjust the skin, ribs and vessels. Tap outside the panel to close it.':'Pulsa Capas para ajustar piel, costillas y vasos. Pulsa fuera para cerrar el panel.','Probe Lab tour':'Recorrido del laboratorio','Drag down the depth strip for deeper, up for shallower.':'Arrastra hacia abajo en la barra para aumentar la profundidad y hacia arriba para reducirla.','Hunt next view':'Buscar la siguiente vista','Start another hunt':'Iniciar otra búsqueda','Checking image…':'Comprobando imagen…','Increase depth':'Aumenta la profundidad','Decrease depth':'Reduce la profundidad','Adjust angle to find the anatomy':'Ajusta el ángulo para encontrar la anatomía','Image match unavailable':'Comparación de imagen no disponible','View acquired · Nicely done':'Vista conseguida · Bien hecho','Use the guide to find the view on the Sim':'Utiliza la guía para encontrar la vista en el simulador','Hide target ghost':'Ocultar sonda de referencia','Show target ghost':'Mostrar sonda de referencia','Hide target ghost and placement ring':'Ocultar sonda y anillo de referencia','Show target ghost and placement ring':'Mostrar sonda y anillo de referencia','Live practice':'Práctica en tiempo real','Reference view':'Vista de referencia','Pull the probe away to begin practice':'Retira la sonda para empezar la práctica','Pull away to begin practice':'Retira la sonda para empezar','Release to begin practice':'Suelta para empezar la práctica','Move onto the mannequin':'Coloca la sonda sobre el maniquí','Grip slides · dashes rotate · tail tilts · background orbits':'Empuñadura: deslizar · Marcas: girar · Extremo: inclinar · Fondo: orbitar',
  'Skip to calculator':'Ir a la calculadora','Echocardiography calculators':'Calculadoras de ecocardiografía','Search all calculators':'Buscar calculadoras','⌃ Categories':'⌃ Categorías','‹ Categories':'‹ Categorías','Choose a calculator':'Elige una calculadora','Choose a tool from the library to begin.':'Elige una herramienta de la biblioteca para comenzar.','‹ Back':'‹ Volver','Measurements':'Mediciones','Enter your measurements below':'Introduce tus mediciones','Clear':'Limpiar','Try a worked example':'Probar un ejemplo resuelto','Formula':'Fórmula','How it works':'Cómo funciona','Reference':'Referencia','Search':'Buscar','Categories':'Categorías','All calculators':'Todas las calculadoras','Normal':'Normal','Mild':'Leve','Moderate':'Moderada','Severe':'Grave','Male':'Masculino','Female':'Femenino','Height':'Estatura','Weight':'Peso','Age':'Edad','Sex':'Sexo','Heart rate':'Frecuencia cardíaca','Body surface area':'Superficie corporal','Left heart':'Corazón izquierdo','Right heart':'Corazón derecho','Aortic stenosis':'Estenosis aórtica','Aortic regurgitation':'Insuficiencia aórtica','Mitral stenosis':'Estenosis mitral','Mitral regurgitation':'Insuficiencia mitral','Tricuspid regurgitation':'Insuficiencia tricuspídea','Pulmonary hypertension':'Hipertensión pulmonar','Diastolic function':'Función diastólica','Systolic function':'Función sistólica','Ejection fraction':'Fracción de eyección','Cardiac output':'Gasto cardíaco','Cardiac index':'Índice cardíaco','Stroke volume':'Volumen sistólico','Stroke volume index':'Índice de volumen sistólico','Fractional shortening':'Fracción de acortamiento','Pericardial disease':'Enfermedad pericárdica','Prosthetic valves':'Prótesis valvulares','Congenital heart disease':'Cardiopatías congénitas','Pressure gradient':'Gradiente de presión','Diameter':'Diámetro','Volume':'Volumen','Velocity':'Velocidad','Area':'Área','Result':'Resultado','Results':'Resultados','Loading…':'Cargando…','Close':'Cerrar','Open':'Abrir','Cancel':'Cancelar','Previous':'Anterior','Reset':'Restablecer','Show':'Mostrar','Hide':'Ocultar','View':'Vista','Save':'Guardar','Example':'Ejemplo','References':'Referencias'
};
const fragments = Object.entries(phrases).filter(([source]) => source.length > 5).sort((left, right) => right[0].length - left[0].length);
const translatedPhrases = { ...window.UMA_ECHO_TRANSLATIONS, ...phrases };
for (const [source, spanish] of Object.entries(translatedPhrases)) {
  if (source.includes(' · ') && spanish.includes(' · ')) {
    const prefix = source.split(' · ')[0];
    if (!translatedPhrases[prefix]) translatedPhrases[prefix] = spanish.split(' · ')[0];
  }
}
const fragmentPattern = new RegExp('(?<![\\p{L}\\p{N}_])(?:' + fragments.map(([source]) => source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\p{N}_])', 'gu');
const localizedValues = new Set();
function translate(value) {
  if (localizedValues.has(value)) return value;
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (translatedPhrases[normalized]) {
    const translated = value.replace(value.trim(), translatedPhrases[normalized]);
    localizedValues.add(translated);
    return translated;
  }
  let result = value;
  result = result.replace(/^Add (.+) to favorites$/, (_, name) => `Añadir ${translate(name)} a favoritos`).replace(/^Remove (.+) from favorites$/, (_, name) => `Quitar ${translate(name)} de favoritos`).replace(/^(.+), (\d+) calculators$/, (_, name, count) => `${translate(name)}, ${count} calculadoras`).replace(/\b(\d+) calculators\b/g, '$1 calculadoras');
  result = result.replace(fragmentPattern, source => phrases[source]);
  return result.replace(/\bLoading anatomy\b/g, 'Cargando anatomía').replace(/\bof 3 files ready\b/g, 'de 3 archivos listos').replace(/\bChecking anatomy…/g, 'Comprobando anatomía…').replace(/\bPreparing the 3D probe…/g, 'Preparando la sonda 3D…').replace(/\bOpening the first clinical cine…/g, 'Abriendo la primera secuencia clínica…').replace(/simulated echo image at/g, 'imagen ecográfica simulada a').replace(/centimetres/g, 'centímetros').replace(/degrees/g, 'grados').replace(/\bfan\b/g, 'inclinación').replace(/\brock\b/g, 'balanceo').replace(/normal clinical cine/g, 'secuencia clínica normal');
}
function localize(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    if (root.parentElement?.closest('script,style,code')) return;
    const translated = translate(root.nodeValue);
    if (translated !== root.nodeValue) root.nodeValue = translated;
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  for (const attribute of ['aria-label', 'title', 'placeholder', 'alt']) {
    if (!root.hasAttribute(attribute)) continue;
    const value = root.getAttribute(attribute);
    const translated = translate(value);
    if (translated !== value) root.setAttribute(attribute, translated);
  }
  for (const child of root.childNodes) localize(child);
}
function initialize() {
  document.documentElement.lang = 'es-PE';
  document.title = document.location.pathname.includes('calculators') ? 'Calculadoras de ecocardiografía | UMA' : 'Simulador de ecocardiografía | UMA';
  const title = document.title;
  new MutationObserver(() => { if (document.title !== title) document.title = title; }).observe(document.querySelector('title'), { childList: true, subtree: true, characterData: true });
  const brand = document.querySelector('.brand');
  if (brand) { brand.innerHTML = '<img src="/uma-logo.jpg" alt="Universidad María Auxiliadora"><strong>Ecocardiografía<small>LABORATORIO UMA</small></strong>'; brand.setAttribute('aria-label', 'Ecocardiografía UMA'); }
  localize(document.body);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'childList') record.addedNodes.forEach(localize);
      else localize(record.target);
    }
  }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label','title','placeholder','alt'] });
  window.parent.postMessage({ type: 'uma-echo-ready' }, window.location.origin);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true }); else initialize();
