export type OrganId =
  | "heart"
  | "brain"
  | "lungs"
  | "liver"
  | "kidneys"
  | "eyeball"
  | "intestine"
  | "pancreas"
  | "skin";

export type Hotspot = {
  id: string;
  label: string;
  /** Name that stands on its own outside the organ, e.g. in the glossary ("Cabeza del páncreas"). */
  term?: string;
  detail: string;
  position: [number, number, number];
  color: string;
  visibleInNormalMode?: boolean;
  visibleInDissection?: boolean;
  requiredRemovedStructures?: string[];
  requiredStage?: number;
};

export type Organ = {
  id: OrganId;
  name: string;
  scientificName: string;
  system: string;
  model: string;
  icon: string;
  accent: string;
  /** Article used to build Spanish phrases: "el corazón", "los pulmones", "la piel". */
  article: "el" | "la" | "los";
  description: string;
  poetic: string;
  size: string;
  weight: string;
  location: string;
  function: string;
  dailyFact: string;
  medical: string;
  bloodSupply: string;
  innervation: string;
  /** Venous drainage, labelled "Vascularización" in the course material. */
  venousDrainage: string;
  funFact: string;
  /** Bibliographic support ("Referencia") for the organ's information. */
  references: string;
  /** Short forms for quiz options and library cards. */
  summary: { function: string; location: string; bloodSupply: string; size: string };
  tissue: string;
  comparison: string;
  conditions: string[];
  hotspots: Hotspot[];
  illustrated: boolean;
};

export const organs: Organ[] = [
  {
    id: "heart",
    name: "Corazón",
    scientificName: "Cor",
    system: "Sistema cardiovascular",
    model: "/models/heart.glb",
    icon: "♥",
    accent: "#e5154f",
    article: "el",
    description: "El corazón es un órgano muscular hueco, perteneciente al sistema cardiovascular, cuya función principal es impulsar la sangre a través de los circuitos pulmonar y sistémico. Está formado por cuatro cavidades (dos aurículas y dos ventrículos) y posee válvulas que permiten el flujo sanguíneo en una sola dirección.",
    poetic: "La bomba incansable",
    size: "Longitud: aproximadamente 12 cm · Anchura: 8–9 cm.",
    weight: "250–350 g, con variación según el individuo.",
    location: "En el mediastino medio, entre los pulmones, detrás del esternón y apoyado sobre el diafragma. Aproximadamente dos tercios se sitúan a la izquierda de la línea media.",
    function: "Impulsar la sangre hacia la circulación pulmonar para oxigenarla y hacia la circulación sistémica para distribuir oxígeno y nutrientes.",
    dailyFact: "Late alrededor de 100 000 veces y bombea aproximadamente 7 000–8 000 litros de sangre en condiciones habituales de reposo y actividad cotidiana.",
    medical: "Las obstrucciones coronarias pueden provocar isquemia, infarto de miocardio y arritmias. Las alteraciones valvulares pueden producir estenosis o insuficiencia valvular y, con el tiempo, insuficiencia cardíaca.",
    bloodSupply: "Arterias coronarias derecha e izquierda, originadas en la aorta ascendente.",
    innervation: "Fibras simpáticas cardíacas, que aumentan la frecuencia y la fuerza de contracción, y fibras parasimpáticas del nervio vago, que disminuyen principalmente la frecuencia cardíaca.",
    venousDrainage: "Venas cardíacas, principalmente las venas cardíacas magna, media y menor, que desembocan en gran parte en el seno coronario y luego en la aurícula derecha.",
    funFact: "El corazón posee un sistema eléctrico propio. El nodo sinoauricular actúa normalmente como marcapasos fisiológico y origina los impulsos que coordinan los latidos.",
    references: "Rouvière y Delmas, Anatomía humana, tomo II, sección «Corazón y vasos del tronco»; Moore, Dalley y Agur, Anatomía con orientación clínica, capítulo del tórax.",
    summary: {
      function: "Impulsar la sangre por la circulación pulmonar y la sistémica",
      location: "Mediastino medio, detrás del esternón",
      bloodSupply: "Arterias coronarias derecha e izquierda",
      size: "Unos 12 cm de largo y 8–9 cm de ancho",
    },
    tissue: "Tejido muscular cardíaco",
    comparison: "Corazón y cerebro",
    conditions: ["Cardiopatía isquémica", "Infarto de miocardio", "Arritmias", "Estenosis valvular", "Insuficiencia valvular", "Insuficiencia cardíaca", "Miocardiopatía", "Cardiopatías congénitas"],
    illustrated: true,
    hotspots: [
      { id: "aorta", label: "Aorta", detail: "Arteria principal de la circulación sistémica", position: [-0.35, 1.65, 0.55], color: "#e5154f" },
      { id: "left-atrium", label: "Aurícula izquierda", detail: "Recibe sangre oxigenada de las venas pulmonares", position: [0.82, 0.65, 0.5], color: "#f2a33b" },
      { id: "right-atrium", label: "Aurícula derecha", detail: "Recibe sangre venosa de las venas cavas y el seno coronario", position: [-0.9, 0.35, 0.55], color: "#6393d8" },
      { id: "left-ventricle", label: "Ventrículo izquierdo", detail: "Impulsa la sangre hacia la aorta", position: [0.7, -0.75, 0.65], color: "#f2a33b" },
      { id: "right-ventricle", label: "Ventrículo derecho", detail: "Impulsa la sangre hacia el tronco pulmonar", position: [-0.65, -0.68, 0.66], color: "#e5154f" },
      { id: "mitral", label: "Válvula mitral", detail: "Impide el reflujo hacia la aurícula izquierda", position: [0.18, -1.35, 0.48], color: "#be185d", visibleInDissection: false },
    ],
  },
  {
    id: "brain",
    name: "Cerebro",
    scientificName: "Cerebrum",
    system: "Sistema nervioso",
    model: "/models/brain.glb",
    icon: "◉",
    accent: "#b5205a",
    article: "el",
    description: "El cerebro es la porción más voluminosa del encéfalo y forma parte del sistema nervioso central. Está constituido por dos hemisferios cerebrales y participa en la percepción sensorial, el movimiento voluntario, el pensamiento, la memoria, el lenguaje, las emociones y otras funciones superiores.",
    poetic: "El universo interior",
    size: "Longitud aproximada: 16–18 cm en el conjunto encefálico, dependiendo de cómo se mida.",
    weight: "Aproximadamente 1 300–1 400 g.",
    location: "Dentro de la cavidad craneal, protegido por el cráneo, las meninges y el líquido cerebroespinal.",
    function: "Procesamiento sensorial, movimiento voluntario, lenguaje, memoria, aprendizaje, emociones, pensamiento y regulación de numerosas funciones corporales.",
    dailyFact: "Permanece activo continuamente durante el sueño y la vigilia. Consume aproximadamente el 20 % del oxígeno utilizado por el organismo en reposo y una proporción similar de su energía.",
    medical: "Un accidente cerebrovascular puede interrumpir el flujo sanguíneo y ocasionar daño neurológico. También son relevantes los traumatismos craneoencefálicos, los tumores, la epilepsia y las enfermedades neurodegenerativas.",
    bloodSupply: "Circulación anterior mediante las arterias carótidas internas y circulación posterior mediante las arterias vertebrales, que se unen para formar la arteria basilar. Sus ramas participan en el círculo arterial cerebral.",
    innervation: "El tejido cerebral no posee una inervación periférica equivalente a la de un músculo. Recibe conexiones neuronales de numerosas vías sensitivas, motoras y autónomas. Los vasos cerebrales tienen inervación autonómica.",
    venousDrainage: "Arterias cerebrales, redes capilares y venas superficiales y profundas; el drenaje llega principalmente a los senos venosos de la duramadre y después a las venas yugulares internas.",
    funFact: "El cerebro contiene alrededor de 86 mil millones de neuronas, aunque la cifra es aproximada. Las conexiones entre neuronas permiten aprender y modificar circuitos funcionales.",
    references: "Rouvière y Delmas, tomo IV, Sistema nervioso central, vías y centros nerviosos; Snell, Neuroanatomía clínica.",
    summary: {
      function: "Procesar la información sensorial y dirigir el movimiento, el lenguaje y la memoria",
      location: "Cavidad craneal",
      bloodSupply: "Arterias carótidas internas y vertebrales",
      size: "Unos 16–18 cm de longitud",
    },
    tissue: "Corteza cerebral",
    comparison: "Cerebro y ojo",
    conditions: ["Accidente cerebrovascular", "Traumatismo craneoencefálico", "Tumores cerebrales", "Epilepsia", "Enfermedades neurodegenerativas", "Migraña", "Esclerosis múltiple", "Aneurisma cerebral"],
    illustrated: true,
    hotspots: [
      { id: "frontal", label: "Lóbulo frontal", detail: "Interviene en la planificación y el movimiento voluntario", position: [-0.7, 0.65, 0.8], color: "#e5154f" },
      { id: "parietal", label: "Lóbulo parietal", detail: "Interviene en la integración sensorial", position: [0.15, 1.1, 0.65], color: "#f2a33b" },
      { id: "temporal", label: "Lóbulo temporal", detail: "Interviene en la memoria y la audición", position: [0.75, -0.1, 0.82], color: "#6393d8" },
      { id: "cerebellum", label: "Cerebelo", detail: "Parte del encéfalo situada bajo el cerebro; coordina el equilibrio y el movimiento", position: [0.72, -0.9, 0.55], color: "#be185d" },
    ],
  },
  {
    id: "lungs",
    name: "Pulmones",
    scientificName: "Pulmones",
    system: "Sistema respiratorio",
    model: "/models/lungs.glb",
    icon: "◍",
    accent: "#dd5072",
    article: "los",
    description: "Los pulmones son dos órganos esponjosos y elásticos del sistema respiratorio, situados dentro de las cavidades torácicas. Contienen un sistema de bronquios, bronquiolos y alvéolos que permite el intercambio de oxígeno y dióxido de carbono entre el aire y la sangre.",
    poetic: "El aliento de la vida",
    size: "Dimensiones aproximadas: 25 cm de altura en un adulto, con variaciones individuales.",
    weight: "Alrededor de 900–1 200 g, variable según el sexo, la talla y el estado de los pulmones.",
    location: "En las cavidades pleurales del tórax, a ambos lados del mediastino, sobre el diafragma.",
    function: "Intercambiar oxígeno y dióxido de carbono entre el aire alveolar y la sangre; además, contribuyen a la regulación del equilibrio ácido-base.",
    dailyFact: "En reposo, una persona adulta suele respirar unas 12–20 veces por minuto y movilizar aproximadamente 6–8 litros de aire por minuto, según sus condiciones. Esto equivale a decenas de miles de respiraciones al día.",
    medical: "Neumonía, asma, enfermedad pulmonar obstructiva crónica, embolia pulmonar y cáncer pulmonar son enfermedades de gran relevancia clínica.",
    bloodSupply: "Las arterias pulmonares transportan sangre poco oxigenada hacia los capilares alveolares. Las arterias bronquiales, procedentes principalmente de la aorta torácica, nutren los tejidos pulmonares.",
    innervation: "Plexos pulmonares con fibras parasimpáticas del nervio vago y simpáticas procedentes de la cadena simpática torácica.",
    venousDrainage: "Las venas pulmonares llevan sangre oxigenada hacia la aurícula izquierda. Las venas bronquiales drenan parte de la circulación nutritiva y pueden desembocar en el sistema ácigos y en las venas pulmonares.",
    funFact: "El pulmón derecho tiene tres lóbulos y el izquierdo tiene dos. El izquierdo presenta una escotadura cardíaca que permite acomodar parte del corazón.",
    references: "Rouvière y Delmas, tomo II, secciones de tórax y vísceras torácicas; Moore, Dalley y Agur, Anatomía con orientación clínica.",
    summary: {
      function: "Intercambiar oxígeno y dióxido de carbono",
      location: "Cavidades pleurales, a ambos lados del mediastino",
      bloodSupply: "Arterias pulmonares y bronquiales",
      size: "Unos 25 cm de altura",
    },
    tissue: "Tejido alveolar",
    comparison: "Pulmones y corazón",
    conditions: ["Neumonía", "Asma", "EPOC", "Embolia pulmonar", "Cáncer de pulmón", "Fibrosis pulmonar", "Bronquitis", "Fibrosis quística"],
    illustrated: true,
    hotspots: [
      { id: "trachea", label: "Tráquea", detail: "Conduce el aire hacia los bronquios", position: [0, 1.6, 0.2], color: "#6393d8" },
      { id: "right-lung", label: "Pulmón derecho", detail: "Pulmón con tres lóbulos", position: [-1.2, 0.1, 0.7], color: "#e5154f" },
      { id: "left-lung", label: "Pulmón izquierdo", detail: "Pulmón con dos lóbulos y escotadura cardíaca", position: [1.2, 0.1, 0.7], color: "#f2a33b" },
      { id: "bronchus", label: "Bronquio principal", detail: "Lleva el aire a cada pulmón y se ramifica", position: [-0.03, 0.3, 0.35], color: "#be185d" },
      { id: "base", label: "Base pulmonar", detail: "Cara inferior del pulmón, que descansa sobre el diafragma", position: [-1.14, -1.2, 1], color: "#7fa88a" },
    ],
  },
  {
    id: "liver",
    name: "Hígado",
    scientificName: "Hepar",
    system: "Sistema digestivo",
    model: "/models/liver.glb",
    icon: "≈",
    accent: "#a9284f",
    article: "el",
    description: "El hígado es una glándula voluminosa y el órgano sólido más grande de la cavidad abdominal. Participa en el metabolismo de los nutrientes, la síntesis de proteínas plasmáticas, la producción de bilis, el almacenamiento de sustancias y la transformación de medicamentos y otros compuestos.",
    poetic: "El alquimista silencioso",
    size: "Anchura aproximada: 20–22 cm.",
    weight: "Alrededor de 1 400–1 800 g en adultos, dependiendo de la constitución corporal.",
    location: "Principalmente en el hipocondrio derecho y el epigastrio, inmediatamente debajo del diafragma.",
    function: "Metabolismo de carbohidratos, lípidos y proteínas; síntesis de albúmina y factores de coagulación; producción de bilis; almacenamiento de glucógeno y ciertas vitaminas; biotransformación de medicamentos y toxinas.",
    dailyFact: "Procesa nutrientes absorbidos, produce bilis, sintetiza proteínas plasmáticas, regula la glucemia, transforma sustancias y participa en la eliminación de numerosos compuestos. Estas funciones se mantienen continuamente.",
    medical: "La hepatitis, la cirrosis, la esteatosis hepática y el carcinoma hepatocelular afectan funciones esenciales. La hipertensión portal puede provocar ascitis y hemorragia por várices esofágicas.",
    bloodSupply: "Arteria hepática propia, habitualmente rama de la arteria hepática común del tronco celíaco.",
    innervation: "Plexo hepático, con fibras simpáticas procedentes del plexo celíaco y fibras parasimpáticas relacionadas con los nervios vagos.",
    venousDrainage: "Recibe sangre de la vena porta hepática y de la arteria hepática. La sangre sale por las venas hepáticas, que desembocan en la vena cava inferior.",
    funFact: "El hígado tiene una doble entrada sanguínea: recibe sangre rica en nutrientes desde el tubo digestivo a través de la vena porta y sangre oxigenada mediante la arteria hepática.",
    references: "Rouvière y Delmas, tomo II, sección de órganos abdominales; Gray, Anatomía para estudiantes, capítulo del abdomen.",
    summary: {
      function: "Metabolizar nutrientes, sintetizar proteínas y producir bilis",
      location: "Hipocondrio derecho y epigastrio, bajo el diafragma",
      bloodSupply: "Arteria hepática propia y vena porta hepática",
      size: "Unos 20–22 cm de ancho",
    },
    tissue: "Lobulillos hepáticos",
    comparison: "Hígado e intestino",
    conditions: ["Hepatitis", "Cirrosis", "Esteatosis hepática", "Carcinoma hepatocelular", "Hipertensión portal", "Ascitis", "Várices esofágicas", "Hemocromatosis"],
    illustrated: true,
    hotspots: [
      { id: "right-lobe", label: "Lóbulo derecho", term: "Lóbulo derecho del hígado", detail: "Lóbulo hepático más grande", position: [-0.75, 0.35, 0.75], color: "#e5154f" },
      { id: "left-lobe", label: "Lóbulo izquierdo", term: "Lóbulo izquierdo del hígado", detail: "Se extiende hacia el epigastrio y el hipocondrio izquierdo", position: [0.85, 0.25, 0.75], color: "#f2a33b" },
      { id: "portal", label: "Vena porta hepática", detail: "Aporta sangre rica en nutrientes desde el tubo digestivo", position: [0.1, -0.3, 0.82], color: "#6393d8" },
    ],
  },
  {
    id: "kidneys",
    name: "Riñones",
    scientificName: "Renes",
    system: "Sistema urinario",
    model: "/models/kidneys.glb",
    icon: "∞",
    accent: "#c82f55",
    article: "los",
    description: "Los riñones son dos órganos glandulares y excretores, con forma de frijol, que forman parte del sistema urinario. Su unidad funcional es la nefrona, encargada de filtrar la sangre y modificar el filtrado para producir orina. Además, regulan el equilibrio hídrico, electrolítico y ácido-base, y participan en el control de la presión arterial y la producción de glóbulos rojos.",
    poetic: "Los filtros maestros",
    size: "Longitud: aproximadamente 10–12 cm · Anchura: 5–7 cm.",
    weight: "Alrededor de 120–170 g por riñón, con variación individual.",
    location: "En la pared posterior del abdomen, a ambos lados de la columna vertebral, en posición retroperitoneal. El riñón derecho suele estar un poco más bajo por la presencia del hígado.",
    function: "Eliminar desechos mediante la orina, regular el agua, los electrolitos y el equilibrio ácido-base, contribuir al control de la presión arterial y producir renina y eritropoyetina; también activan la vitamina D.",
    dailyFact: "Filtran aproximadamente 150–180 litros de filtrado glomerular al día en muchos adultos sanos. La mayor parte se reabsorbe y se eliminan normalmente alrededor de 1–2 litros de orina, dependiendo de la hidratación y otros factores.",
    medical: "La enfermedad renal crónica, los cálculos, las infecciones urinarias altas y la lesión renal aguda pueden alterar la eliminación de desechos y el equilibrio interno del organismo.",
    bloodSupply: "Arterias renales derecha e izquierda, que nacen de la aorta abdominal y se dividen en ramas segmentarias.",
    innervation: "Plexo renal con fibras simpáticas, principalmente toracolumbares, y aferencias viscerales. La regulación parasimpática es limitada y menos relevante para la función renal cotidiana.",
    venousDrainage: "Redes capilares glomerulares y peritubulares; venas renales que desembocan en la vena cava inferior.",
    funFact: "Cada riñón contiene aproximadamente un millón de nefronas, aunque la cifra varía. Estas unidades funcionales realizan la filtración y los procesos de reabsorción y secreción que forman la orina.",
    references: "Rouvière y Delmas, tomo II, sección de órganos de la región lumbar y aparato urinario; Moore, Dalley y Agur, Anatomía con orientación clínica.",
    summary: {
      function: "Filtrar la sangre y producir orina",
      location: "A ambos lados de la columna vertebral, en la pared abdominal posterior",
      bloodSupply: "Arterias renales, ramas de la aorta abdominal",
      size: "Unos 10–12 cm de largo y 5–7 cm de ancho",
    },
    tissue: "Corteza renal",
    comparison: "Riñones e hígado",
    conditions: ["Enfermedad renal crónica", "Lesión renal aguda", "Cálculos renales", "Pielonefritis", "Glomerulonefritis", "Síndrome nefrótico", "Poliquistosis renal", "Hipertensión renovascular"],
    illustrated: true,
    hotspots: [
      { id: "cortex", label: "Corteza renal", detail: "Capa externa donde se encuentran los glomérulos", position: [-0.9, 0.55, 0.7], color: "#e5154f" },
      { id: "medulla", label: "Médula renal", detail: "Concentra la orina", position: [0.85, 0.2, 0.7], color: "#f2a33b" },
      { id: "ureter", label: "Uréter", detail: "Conduce la orina hacia la vejiga", position: [0.4, -1.1, 0.5], color: "#6393d8" },
    ],
  },
  {
    id: "eyeball",
    name: "Ojo",
    scientificName: "Bulbus oculi",
    system: "Sistema sensorial",
    model: "/models/eyeball.glb",
    icon: "⊙",
    accent: "#607ea3",
    article: "el",
    description: "El ojo es el órgano de la visión, especializado en captar la luz y convertirla en señales nerviosas que se transmiten al cerebro a través del nervio óptico. Su estructura comprende, entre otros elementos, la córnea, el iris, el cristalino, la retina y los medios transparentes que permiten enfocar la imagen.",
    poetic: "Una ventana hecha de luz",
    size: "Diámetro del globo ocular adulto: aproximadamente 24 mm.",
    weight: "Alrededor de 7–8 g por ojo.",
    location: "En la órbita del cráneo, protegido por los párpados, las pestañas, el aparato lagrimal y la grasa orbitaria.",
    function: "Captar la luz, enfocar imágenes en la retina y convertirlas en impulsos nerviosos que se transmiten al cerebro.",
    dailyFact: "Recibe luz continuamente durante la vigilia y transforma los estímulos luminosos en señales nerviosas. Los movimientos oculares, el enfoque y los reflejos pupilares se ajustan constantemente.",
    medical: "El glaucoma puede lesionar el nervio óptico; las cataratas opacifican el cristalino; el desprendimiento de retina puede comprometer gravemente la visión.",
    bloodSupply: "Principalmente la arteria oftálmica, rama de la carótida interna. La arteria central de la retina irriga gran parte de las capas internas de la retina; las arterias ciliares irrigan otras estructuras oculares.",
    innervation: "Nervio óptico (II par craneal) para la visión; nervios oculomotor (III), troclear (IV) y abducens (VI) para los movimientos oculares; fibras parasimpáticas del III par para la constricción pupilar y la acomodación, y fibras simpáticas para la dilatación pupilar.",
    venousDrainage: "Vena central de la retina y venas oftálmicas superior e inferior, con drenaje hacia el seno cavernoso y otras conexiones venosas orbitarias.",
    funFact: "La retina es tejido nervioso especializado. Los conos permiten distinguir colores y detalles finos, mientras que los bastones son especialmente sensibles a niveles bajos de iluminación.",
    references: "Rouvière y Delmas, tomo I, sección de los órganos de los sentidos; Moore, Dalley y Agur, capítulos de cabeza y órbita.",
    summary: {
      function: "Captar la luz y convertirla en impulsos nerviosos",
      location: "Órbita del cráneo",
      bloodSupply: "Arteria oftálmica",
      size: "Unos 24 mm de diámetro",
    },
    tissue: "Capas de la retina",
    comparison: "Ojo y cerebro",
    conditions: ["Glaucoma", "Catarata", "Desprendimiento de retina", "Degeneración macular", "Miopía", "Astigmatismo", "Ojo seco", "Conjuntivitis"],
    illustrated: true,
    hotspots: [
      { id: "cornea", label: "Córnea", detail: "Superficie transparente que enfoca la luz", position: [-0.94, 0.05, 1.47], color: "#6393d8" },
      { id: "iris", label: "Iris", detail: "Regula el tamaño de la pupila y la entrada de luz", position: [-1.22, -0.53, 1.15], color: "#f2a33b" },
      { id: "optic", label: "Nervio óptico", detail: "Transmite las señales visuales al cerebro", position: [1.61, -0.18, 0.54], color: "#be185d" },
    ],
  },
  {
    id: "intestine",
    name: "Intestino",
    scientificName: "Intestinum",
    system: "Sistema digestivo",
    model: "/models/intestine.glb",
    icon: "§",
    accent: "#d15a70",
    article: "el",
    description: "El intestino es un conducto del aparato digestivo que se extiende desde el píloro hasta el ano y se divide en intestino delgado e intestino grueso. El intestino delgado interviene principalmente en la digestión y absorción de nutrientes, mientras que el intestino grueso participa en la absorción de agua y electrolitos, la formación de las heces y la actividad de la microbiota intestinal.",
    poetic: "El jardín interior",
    size: "Intestino delgado: aproximadamente 3–6 m de longitud en el adulto vivo, según el método de medición · Intestino grueso: aproximadamente 1,5 m.",
    weight: "Variable según el segmento y su contenido; no existe un único valor estándar útil para todo el intestino.",
    location: "Desde el píloro gástrico hasta el ano. Ocupa principalmente la cavidad abdominal y continúa en la pelvis.",
    function: "Digestión, absorción de nutrientes, recuperación de agua y electrolitos, desplazamiento del contenido intestinal y eliminación de residuos.",
    dailyFact: "Mezcla y propulsa el contenido mediante contracciones; digiere alimentos y absorbe nutrientes, agua y electrolitos. El intestino grueso también participa en la fermentación bacteriana y la formación de heces.",
    medical: "Apendicitis, enfermedad inflamatoria intestinal, obstrucción intestinal, enfermedad diverticular y cáncer colorrectal son problemas clínicos relevantes.",
    bloodSupply: "El intestino delgado recibe principalmente ramas de las arterias pancreaticoduodenales y de la arteria mesentérica superior. El intestino grueso recibe ramas de las arterias mesentéricas superior e inferior; el recto también recibe ramas de la ilíaca interna.",
    innervation: "Sistema nervioso entérico, con los plexos mientérico de Auerbach y submucoso de Meissner. El parasimpático procede principalmente de los nervios vagos y de los nervios esplácnicos pélvicos; el simpático llega a través de plexos periarteriales.",
    venousDrainage: "Las venas mesentéricas superior e inferior drenan gran parte del intestino hacia el sistema porta hepático. El drenaje del recto es particular porque conecta los sistemas portal y sistémico.",
    funFact: "La superficie de absorción del intestino delgado aumenta gracias a los pliegues circulares, las vellosidades y las microvellosidades. Esta organización permite absorber nutrientes de manera eficiente.",
    references: "Rouvière y Delmas, tomo II, sección de órganos abdominales; Moore, Dalley y Agur, capítulo del abdomen.",
    summary: {
      function: "Digerir y absorber nutrientes, agua y electrolitos",
      location: "Del píloro al ano, en la cavidad abdominal y la pelvis",
      bloodSupply: "Arterias mesentéricas superior e inferior",
      size: "Delgado: 3–6 m; grueso: unos 1,5 m",
    },
    tissue: "Vellosidades intestinales",
    comparison: "Intestino e hígado",
    conditions: ["Apendicitis", "Enfermedad inflamatoria intestinal", "Obstrucción intestinal", "Enfermedad diverticular", "Cáncer colorrectal", "Enfermedad celíaca", "Síndrome de intestino irritable", "Pólipos colorrectales"],
    illustrated: true,
    hotspots: [
      { id: "duodenum", label: "Duodeno", detail: "Primer segmento del intestino delgado", position: [0.6, 0.8, 0.75], color: "#f2a33b" },
      { id: "jejunum", label: "Yeyuno", detail: "Principal región de absorción", position: [-0.45, 0.1, 0.82], color: "#e5154f" },
      { id: "colon", label: "Colon", detail: "Absorbe agua y electrolitos y forma las heces", position: [0.75, -0.55, 0.72], color: "#6393d8" },
    ],
  },
  {
    id: "pancreas",
    name: "Páncreas",
    scientificName: "Pancreas",
    system: "Sistema digestivo y endocrino",
    model: "/models/pancreas.glb",
    icon: "◈",
    accent: "#b88334",
    article: "el",
    description: "El páncreas es una glándula mixta del aparato digestivo y del sistema endocrino, situada detrás del estómago. Su porción exocrina produce enzimas digestivas y bicarbonato que llegan al duodeno, mientras que su porción endocrina secreta hormonas como la insulina y el glucagón, que contribuyen a regular la glucosa sanguínea.",
    poetic: "El regulador silencioso",
    size: "Longitud: aproximadamente 15–20 cm.",
    weight: "Alrededor de 70–100 g.",
    location: "En la parte superior del abdomen, principalmente detrás del estómago y en posición retroperitoneal. Su cabeza está rodeada por el duodeno y su cola se dirige hacia el bazo.",
    function: "Tiene dos componentes principales. Exocrino: libera amilasa, lipasa, proteasas y bicarbonato al duodeno para facilitar la digestión. Endocrino: los islotes pancreáticos producen insulina, glucagón, somatostatina y otras sustancias reguladoras.",
    dailyFact: "Produce jugo pancreático con enzimas digestivas y bicarbonato; además, libera hormonas que regulan la glucosa y otros procesos metabólicos.",
    medical: "La pancreatitis aguda puede ocasionar dolor abdominal intenso y complicaciones sistémicas. La diabetes mellitus se relaciona con alteraciones de la producción o acción de la insulina; el cáncer pancreático tiene elevada relevancia clínica.",
    bloodSupply: "La cabeza recibe ramas de las arterias pancreaticoduodenales superiores e inferiores. El cuerpo y la cola reciben ramas de la arteria esplénica.",
    innervation: "Plexos pancreáticos con fibras simpáticas y parasimpáticas relacionadas con los nervios vagos.",
    venousDrainage: "Las venas pancreáticas del cuerpo y la cola drenan en la vena esplénica; las venas pancreaticoduodenales de la cabeza drenan en la vena mesentérica superior y en la vena porta hepática, que se forma detrás del cuello del páncreas.",
    funFact: "El páncreas es una glándula mixta: participa tanto en la digestión como en la regulación hormonal. Sus enzimas proteolíticas se secretan principalmente como precursores inactivos para reducir el riesgo de autodigestión.",
    references: "Rouvière y Delmas, tomo II, sección de órganos abdominales; Gray, Anatomía para estudiantes, capítulo del abdomen.",
    summary: {
      function: "Secretar enzimas digestivas y hormonas como la insulina",
      location: "Detrás del estómago, con la cabeza rodeada por el duodeno",
      bloodSupply: "Arterias pancreaticoduodenales y arteria esplénica",
      size: "Unos 15–20 cm de largo",
    },
    tissue: "Ácinos pancreáticos",
    comparison: "Páncreas e hígado",
    conditions: ["Pancreatitis aguda", "Pancreatitis crónica", "Diabetes mellitus tipo 1", "Diabetes mellitus tipo 2", "Cáncer de páncreas", "Insuficiencia pancreática exocrina", "Quistes pancreáticos", "Insulinoma"],
    illustrated: true,
    hotspots: [
      { id: "head", label: "Cabeza", term: "Cabeza del páncreas", detail: "Porción rodeada por el duodeno", position: [-1.32, -0.36, 0.55], color: "#e5154f" },
      { id: "body", label: "Cuerpo", term: "Cuerpo del páncreas", detail: "Cruza por delante de la aorta y la columna vertebral", position: [0.05, 0.25, 0.45], color: "#f2a33b" },
      { id: "tail", label: "Cola", term: "Cola del páncreas", detail: "Porción que se dirige hacia el bazo", position: [1.55, 0.3, 0.35], color: "#6393d8" },
      { id: "duct", label: "Conducto pancreático", detail: "Lleva el jugo pancreático al duodeno", position: [-0.61, 0.39, 0.5], color: "#be185d" },
    ],
  },
  {
    id: "skin",
    name: "Piel",
    scientificName: "Cutis",
    system: "Sistema tegumentario",
    model: "/models/skin.glb",
    icon: "▦",
    accent: "#c47a68",
    article: "la",
    description: "La piel es el órgano que recubre la superficie externa del cuerpo y constituye una barrera protectora frente al ambiente. Está formada por la epidermis y la dermis, y se relaciona estrechamente con la hipodermis subyacente. Cumple funciones de protección, sensibilidad, regulación térmica, defensa inmunitaria y participación en la síntesis de vitamina D.",
    poetic: "El límite viviente",
    size: "Superficie: aproximadamente 1,5–2 m² en un adulto.",
    weight: "Cerca de 3–5 kg para la piel propiamente dicha, con variaciones individuales. Si se incluyen tejidos subcutáneos, la cifra puede ser mucho mayor.",
    location: "Recubre prácticamente toda la superficie externa del cuerpo. Se compone de epidermis y dermis; debajo se encuentra la hipodermis o tejido subcutáneo, que no forma parte de la piel propiamente dicha.",
    function: "Protección, sensibilidad, termorregulación, defensa inmunitaria y participación en la síntesis de vitamina D mediante la exposición a radiación ultravioleta.",
    dailyFact: "Mantiene una barrera frente al medio externo, limita la pérdida de agua, participa en la regulación de la temperatura y detecta estímulos como presión, vibración, dolor y temperatura.",
    medical: "Las quemaduras comprometen la barrera cutánea y pueden producir pérdidas de líquidos; las infecciones, las úlceras por presión, la dermatitis y el cáncer de piel son problemas clínicos frecuentes.",
    bloodSupply: "La epidermis carece de vasos sanguíneos; recibe nutrientes por difusión desde los capilares de la dermis. La dermis y la hipodermis reciben ramas de redes arteriales cutáneas.",
    innervation: "Terminaciones nerviosas libres y receptores sensoriales especializados; fibras simpáticas autónomas regulan los vasos sanguíneos, las glándulas sudoríparas y los músculos erectores del pelo.",
    venousDrainage: "Plexos vasculares dérmicos superficiales y profundos, con drenaje por venas cutáneas hacia los sistemas venosos regionales. La circulación cutánea también contribuye a disipar o conservar calor.",
    funFact: "La piel es el órgano de mayor superficie del cuerpo. Su epidermis se renueva de forma continua y su velocidad de renovación varía según la región corporal, la edad y las condiciones de salud.",
    references: "Rouvière y Delmas, secciones de tegumentos y anatomía de superficie; Moore, Dalley y Agur, Anatomía con orientación clínica.",
    summary: {
      function: "Proteger, percibir estímulos y regular la temperatura",
      location: "Recubre toda la superficie externa del cuerpo",
      bloodSupply: "Redes arteriales cutáneas de la dermis",
      size: "Unos 1,5–2 m² de superficie",
    },
    tissue: "Capas de la epidermis",
    comparison: "Piel e intestino",
    conditions: ["Quemaduras", "Úlceras por presión", "Infecciones cutáneas", "Dermatitis", "Cáncer de piel", "Psoriasis", "Acné vulgar", "Vitíligo"],
    illustrated: true,
    hotspots: [
      { id: "epidermis", label: "Epidermis", detail: "Capa protectora externa, sin vasos sanguíneos", position: [-0.05, 0.88, 1.4], color: "#e5154f" },
      { id: "dermis", label: "Dermis", detail: "Capa de la piel con nervios, vasos y glándulas", position: [0.29, 0.05, 1.4], color: "#f2a33b" },
      { id: "hypodermis", label: "Hipodermis", detail: "Tejido subcutáneo bajo la piel: grasa y aislamiento", position: [-0.39, -1.15, 1.4], color: "#6393d8" },
      { id: "follicle", label: "Folículo piloso", detail: "Origina y ancla cada pelo", position: [0.89, -0.44, 1.4], color: "#be185d" },
    ],
  },
];

export const organById = Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<OrganId, Organ>;

const CONTRACTIONS = { el: { de: "del", a: "al" }, la: { de: "de la", a: "a la" }, los: { de: "de los", a: "a los" } } as const;

/** The organ's name inside a Spanish sentence: "el corazón", "del hígado", "a los pulmones". */
export function organPhrase(organ: Organ, preposition?: "de" | "a") {
  const name = organ.name.toLowerCase();
  return `${preposition ? CONTRACTIONS[organ.article][preposition] : organ.article} ${name}`;
}

export const isPluralOrgan = (organ: Organ) => organ.article === "los";
