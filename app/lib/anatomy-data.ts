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
  description: string;
  poetic: string;
  size: string;
  weight: string;
  location: string;
  function: string;
  dailyFact: string;
  medical: string;
  bloodSupply: string;
  funFact: string;
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
    description: "Órgano muscular que bombea sangre por todo el cuerpo y lleva oxígeno y nutrientes a cada célula.",
    poetic: "La bomba incansable",
    size: "Aproximadamente como tu puño",
    weight: "250–350 g",
    location: "Detrás del esternón, ligeramente a la izquierda",
    function: "Hace circular la sangre oxigenada",
    dailyFact: "Late cerca de 100 000 veces",
    medical: "Su ritmo eléctrico coordina cada latido.",
    bloodSupply: "Arterias coronarias derecha e izquierda",
    funFact: "Late alrededor de 2 500 millones de veces durante una vida promedio y comienza antes del nacimiento.",
    tissue: "Tejido muscular cardíaco",
    comparison: "Corazón y cerebro",
    conditions: ["Enfermedad coronaria", "Arritmia", "Valvulopatías", "Insuficiencia cardíaca", "Miocardiopatía", "Miocarditis", "Fibrilación auricular", "Cardiopatías congénitas"],
    illustrated: true,
    hotspots: [
      { id: "aorta", label: "Aorta", detail: "Arteria principal", position: [-0.35, 1.65, 0.55], color: "#e5154f" },
      { id: "left-atrium", label: "Aurícula izquierda", detail: "Recibe sangre oxigenada", position: [0.82, 0.65, 0.5], color: "#f2a33b" },
      { id: "right-atrium", label: "Aurícula derecha", detail: "Recibe sangre venosa", position: [-0.9, 0.35, 0.55], color: "#6393d8" },
      { id: "left-ventricle", label: "Ventrículo izquierdo", detail: "Bombea hacia el cuerpo", position: [0.7, -0.75, 0.65], color: "#f2a33b" },
      { id: "right-ventricle", label: "Ventrículo derecho", detail: "Bombea hacia los pulmones", position: [-0.65, -0.68, 0.66], color: "#e5154f" },
      { id: "mitral", label: "Válvula mitral", detail: "Evita el retroceso de la sangre", position: [0.18, -1.35, 0.48], color: "#be185d", visibleInDissection: false },
    ],
  },
  {
    id: "brain",
    name: "Cerebro",
    scientificName: "Encephalon",
    system: "Sistema nervioso",
    model: "/models/brain.glb",
    icon: "◉",
    accent: "#b5205a",
    description: "Centro de control del cuerpo: integra sensaciones, memoria, emociones y movimientos precisos.",
    poetic: "El universo interior",
    size: "Aproximadamente dos puños cerrados",
    weight: "1,3–1,4 kg",
    location: "Protegido dentro del cráneo",
    function: "Procesa y coordina señales",
    dailyFact: "Utiliza cerca del 20 % de la energía corporal",
    medical: "Miles de millones de neuronas se comunican mediante señales eléctricas y químicas.",
    bloodSupply: "Arterias carótidas internas y vertebrales",
    funFact: "No tiene receptores del dolor propios; el dolor de cabeza se percibe en los tejidos que lo rodean.",
    tissue: "Corteza cerebral",
    comparison: "Cerebro y ojo",
    conditions: ["Migraña", "Accidente cerebrovascular", "Enfermedades neurodegenerativas", "Epilepsia", "Traumatismo craneoencefálico", "Meningitis", "Esclerosis múltiple", "Aneurisma cerebral"],
    illustrated: true,
    hotspots: [
      { id: "frontal", label: "Lóbulo frontal", detail: "Planificación y movimiento", position: [-0.7, 0.65, 0.8], color: "#e5154f" },
      { id: "parietal", label: "Lóbulo parietal", detail: "Integración sensorial", position: [0.15, 1.1, 0.65], color: "#f2a33b" },
      { id: "temporal", label: "Lóbulo temporal", detail: "Memoria y audición", position: [0.75, -0.1, 0.82], color: "#6393d8" },
      { id: "cerebellum", label: "Cerebelo", detail: "Equilibrio y coordinación", position: [0.72, -0.9, 0.55], color: "#be185d" },
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
    description: "Órganos pares que reciben aire e intercambian oxígeno por dióxido de carbono en una extensa y delicada superficie.",
    poetic: "El aliento de la vida",
    size: "Cada uno mide cerca de 25 cm de alto",
    weight: "Alrededor de 1 kg entre ambos",
    location: "A ambos lados del corazón, dentro de la caja torácica",
    function: "Intercambian oxígeno y dióxido de carbono",
    dailyFact: "Movilizan unos 11 000 L de aire",
    medical: "Los alvéolos pliegan dentro del tórax una superficie de intercambio similar a una cancha de tenis.",
    bloodSupply: "Arterias pulmonares y bronquiales",
    funFact: "El pulmón derecho tiene tres lóbulos y el izquierdo solo dos, dejando espacio para el corazón.",
    tissue: "Tejido alveolar",
    comparison: "Pulmones y corazón",
    conditions: ["Asma", "EPOC", "Neumonía", "Embolia pulmonar", "Fibrosis pulmonar", "Bronquitis", "Fibrosis quística", "Cáncer de pulmón"],
    illustrated: true,
    hotspots: [
      { id: "trachea", label: "Tráquea", detail: "Conduce aire a los pulmones", position: [0, 1.6, 0.2], color: "#6393d8" },
      { id: "right-lung", label: "Pulmón derecho", detail: "Tres lóbulos", position: [-1.2, 0.1, 0.7], color: "#e5154f" },
      { id: "left-lung", label: "Pulmón izquierdo", detail: "Dos lóbulos y espacio para el corazón", position: [1.2, 0.1, 0.7], color: "#f2a33b" },
      { id: "bronchus", label: "Bronquio", detail: "Vía respiratoria ramificada", position: [-0.03, 0.3, 0.35], color: "#be185d" },
      { id: "base", label: "Base pulmonar", detail: "Descansa sobre el diafragma", position: [-1.14, -1.2, 1], color: "#7fa88a" },
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
    description: "Órgano metabólico extraordinario que filtra la sangre, procesa nutrientes y produce bilis.",
    poetic: "El alquimista silencioso",
    size: "Aproximadamente como un balón de fútbol",
    weight: "1,4–1,6 kg",
    location: "Parte superior derecha del abdomen",
    function: "Metabolismo, desintoxicación y producción de bilis",
    dailyFact: "Realiza más de 500 funciones",
    medical: "Puede regenerar una parte considerable del tejido perdido.",
    bloodSupply: "Arteria hepática y vena porta",
    funFact: "Es el único órgano humano capaz de recuperar su tamaño completo a partir de una fracción de sí mismo.",
    tissue: "Lobulillos hepáticos",
    comparison: "Hígado e intestino",
    conditions: ["Hígado graso", "Hepatitis", "Cirrosis", "Cálculos biliares", "Hemocromatosis", "Cáncer de hígado", "Hepatitis autoinmune", "Hipertensión portal"],
    illustrated: true,
    hotspots: [
      { id: "right-lobe", label: "Lóbulo derecho", detail: "Lóbulo hepático más grande", position: [-0.75, 0.35, 0.75], color: "#e5154f" },
      { id: "left-lobe", label: "Lóbulo izquierdo", detail: "Cruza la línea media", position: [0.85, 0.25, 0.75], color: "#f2a33b" },
      { id: "portal", label: "Vena porta", detail: "Entrada de sangre rica en nutrientes", position: [0.1, -0.3, 0.82], color: "#6393d8" },
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
    description: "Órganos pares de filtración que equilibran líquidos, electrolitos y presión arterial, además de eliminar desechos.",
    poetic: "Los filtros maestros",
    size: "Cada uno es similar a un ratón de computadora",
    weight: "120–170 g cada uno",
    location: "A ambos lados de la columna, debajo de las costillas",
    function: "Filtran la sangre y forman la orina",
    dailyFact: "Filtran cerca de 180 L de líquido",
    medical: "Las nefronas ajustan con precisión la composición química de la sangre.",
    bloodSupply: "Arterias renales",
    funFact: "Recuperan casi todo lo que filtran; solo entre 1 y 2 L salen del cuerpo como orina.",
    tissue: "Corteza renal",
    comparison: "Riñones e hígado",
    conditions: ["Cálculos renales", "Enfermedad renal crónica", "Infección urinaria", "Glomerulonefritis", "Enfermedad renal poliquística", "Hipertensión renal", "Lesión renal aguda", "Síndrome nefrótico"],
    illustrated: true,
    hotspots: [
      { id: "cortex", label: "Corteza renal", detail: "Capa externa de filtración", position: [-0.9, 0.55, 0.7], color: "#e5154f" },
      { id: "medulla", label: "Médula renal", detail: "Concentra la orina", position: [0.85, 0.2, 0.7], color: "#f2a33b" },
      { id: "ureter", label: "Uréter", detail: "Transporta la orina", position: [0.4, -1.1, 0.5], color: "#6393d8" },
    ],
  },
  {
    id: "eyeball",
    name: "Ojo",
    scientificName: "Oculus",
    system: "Sistema sensorial",
    model: "/models/eyeball.glb",
    icon: "⊙",
    accent: "#607ea3",
    description: "Órgano sensorial de gran precisión que convierte la luz enfocada en señales nerviosas interpretadas como visión.",
    poetic: "Una ventana hecha de luz",
    size: "Cerca de 24 mm de diámetro",
    weight: "Alrededor de 7,5 g",
    location: "Dentro de la órbita ósea",
    function: "Capta y enfoca la luz",
    dailyFact: "Realiza miles de pequeños movimientos",
    medical: "La retina es una extensión del sistema nervioso central.",
    bloodSupply: "Arteria oftálmica",
    funFact: "La córnea no tiene vasos sanguíneos; obtiene el oxígeno directamente del aire.",
    tissue: "Capas de la retina",
    comparison: "Ojo y cerebro",
    conditions: ["Miopía", "Catarata", "Glaucoma", "Degeneración macular", "Desprendimiento de retina", "Ojo seco", "Astigmatismo", "Conjuntivitis"],
    illustrated: true,
    hotspots: [
      { id: "cornea", label: "Córnea", detail: "Superficie transparente de enfoque", position: [-0.94, 0.05, 1.47], color: "#6393d8" },
      { id: "iris", label: "Iris", detail: "Regula la entrada de luz", position: [-1.22, -0.53, 1.15], color: "#f2a33b" },
      { id: "optic", label: "Nervio óptico", detail: "Transporta las señales visuales", position: [1.61, -0.18, 0.54], color: "#be185d" },
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
    description: "Conducto digestivo plegado donde se absorben nutrientes y el microbioma contribuye a la salud de todo el organismo.",
    poetic: "El jardín interior",
    size: "Mide entre 6 y 7 m extendido",
    weight: "Varía según su contenido",
    location: "Parte central e inferior del abdomen",
    function: "Digestión y absorción de nutrientes",
    dailyFact: "Alberga billones de microorganismos",
    medical: "Su superficie aumenta gracias a pliegues, vellosidades y microvellosidades.",
    bloodSupply: "Arterias mesentéricas superior e inferior",
    funFact: "Su revestimiento se renueva cada pocos días: es el tejido con mayor recambio del cuerpo.",
    tissue: "Vellosidades intestinales",
    comparison: "Intestino e hígado",
    conditions: ["Síndrome de intestino irritable", "Enfermedad inflamatoria intestinal", "Enfermedad celíaca", "Diverticulitis", "Obstrucción intestinal", "Pólipos colorrectales", "Enfermedad de Crohn", "Intolerancia a la lactosa"],
    illustrated: true,
    hotspots: [
      { id: "duodenum", label: "Duodeno", detail: "Primer segmento del intestino delgado", position: [0.6, 0.8, 0.75], color: "#f2a33b" },
      { id: "jejunum", label: "Yeyuno", detail: "Principal región de absorción", position: [-0.45, 0.1, 0.82], color: "#e5154f" },
      { id: "colon", label: "Colon", detail: "Reabsorbe agua", position: [0.75, -0.55, 0.72], color: "#6393d8" },
    ],
  },
  {
    id: "pancreas",
    name: "Páncreas",
    scientificName: "Pancreas",
    system: "Sistema endocrino",
    model: "/models/pancreas.glb",
    icon: "◈",
    accent: "#b88334",
    description: "Glándula de doble función que libera enzimas digestivas en el intestino y hormonas que regulan la glucosa.",
    poetic: "El regulador silencioso",
    size: "Mide cerca de 15 cm de largo",
    weight: "70–100 g",
    location: "Detrás del estómago, en la parte superior del abdomen",
    function: "Produce enzimas digestivas e insulina",
    dailyFact: "Genera cerca de 1,5 L de jugo rico en enzimas",
    medical: "Los islotes de Langerhans liberan insulina y glucagón para equilibrar la glucosa sanguínea.",
    bloodSupply: "Arterias esplénica y pancreaticoduodenales",
    funFact: "Apenas el 2 % produce hormonas; el resto se dedica a elaborar enzimas digestivas.",
    tissue: "Ácinos pancreáticos",
    comparison: "Páncreas e hígado",
    conditions: ["Pancreatitis", "Diabetes tipo 1", "Cáncer de páncreas", "Diabetes tipo 2", "Insuficiencia exocrina", "Quistes pancreáticos", "Pancreatitis biliar", "Insulinoma"],
    illustrated: true,
    hotspots: [
      { id: "head", label: "Cabeza", detail: "Rodeada por el duodeno", position: [-1.32, -0.36, 0.55], color: "#e5154f" },
      { id: "body", label: "Cuerpo", detail: "Cruza por delante de la columna", position: [0.05, 0.25, 0.45], color: "#f2a33b" },
      { id: "tail", label: "Cola", detail: "Se extiende hacia el bazo", position: [1.55, 0.3, 0.35], color: "#6393d8" },
      { id: "duct", label: "Conducto pancreático", detail: "Lleva enzimas al intestino", position: [-0.61, 0.39, 0.5], color: "#be185d" },
    ],
  },
  {
    id: "skin",
    name: "Piel",
    scientificName: "Integumentum",
    system: "Sistema tegumentario",
    model: "/models/skin.glb",
    icon: "▦",
    accent: "#c47a68",
    description: "El órgano más grande del cuerpo: una barrera viva que percibe el tacto, retiene agua y regula la temperatura.",
    poetic: "El límite viviente",
    size: "Cerca de 2 m² al extenderla",
    weight: "3,5–5 kg",
    location: "Cubre todo el cuerpo",
    function: "Protege, percibe y regula la temperatura",
    dailyFact: "Elimina unos 500 millones de células",
    medical: "Sus tres capas —epidermis, dermis e hipodermis— cumplen funciones diferentes.",
    bloodSupply: "Plexo vascular dérmico",
    funFact: "Un solo centímetro cuadrado puede contener cientos de glándulas sudoríparas y metros de vasos sanguíneos.",
    tissue: "Capas de la epidermis",
    comparison: "Piel e intestino",
    conditions: ["Eccema", "Psoriasis", "Melanoma", "Acné vulgar", "Celulitis", "Dermatitis de contacto", "Rosácea", "Vitíligo"],
    illustrated: true,
    hotspots: [
      { id: "epidermis", label: "Epidermis", detail: "Capa protectora externa", position: [-0.05, 0.88, 1.4], color: "#e5154f" },
      { id: "dermis", label: "Dermis", detail: "Nervios, vasos y glándulas", position: [0.29, 0.05, 1.4], color: "#f2a33b" },
      { id: "hypodermis", label: "Hipodermis", detail: "Grasa y aislamiento", position: [-0.39, -1.15, 1.4], color: "#6393d8" },
      { id: "follicle", label: "Folículo piloso", detail: "Ancla cada cabello", position: [0.89, -0.44, 1.4], color: "#be185d" },
    ],
  },
];

export const organById = Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<OrganId, Organ>;
