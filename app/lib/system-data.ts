export type AnatomySystem = {
  id: string;
  name: string;
  icon: string;
  description: string;
  primaryFunction: string;
  relationship: string;
  facts: string[];
};

export const anatomySystems: AnatomySystem[] = [
  {
    id: "cardiovascular",
    name: "Sistema cardiovascular",
    icon: "♥",
    description: "Red de transporte que distribuye sangre, oxígeno y nutrientes por el organismo.",
    primaryFunction: "Mantener la circulación y el intercambio continuo entre los tejidos.",
    relationship: "El corazón impulsa la sangre a través de arterias, capilares y venas.",
    facts: ["Trabaja de forma continua", "Se adapta a la actividad física", "Conecta todos los órganos"],
  },
  {
    id: "nervioso",
    name: "Sistema nervioso",
    icon: "◉",
    description: "Integra información sensorial y coordina respuestas, pensamiento y movimiento.",
    primaryFunction: "Procesar señales y dirigir la actividad del cuerpo.",
    relationship: "El cerebro interpreta información y se comunica con el organismo mediante vías nerviosas.",
    facts: ["Utiliza señales eléctricas y químicas", "Integra memoria y emoción", "Coordina respuestas rápidas"],
  },
  {
    id: "respiratorio",
    name: "Sistema respiratorio",
    icon: "◍",
    description: "Conduce aire y permite el intercambio de oxígeno y dióxido de carbono.",
    primaryFunction: "Oxigenar la sangre y eliminar dióxido de carbono.",
    relationship: "Los pulmones trabajan estrechamente con el sistema cardiovascular.",
    facts: ["El intercambio ocurre en los alvéolos", "La respiración se adapta al esfuerzo", "El diafragma impulsa la ventilación"],
  },
  {
    id: "digestivo",
    name: "Sistema digestivo",
    icon: "≈",
    description: "Procesa alimentos, absorbe nutrientes y transforma sustancias para el metabolismo.",
    primaryFunction: "Obtener nutrientes y eliminar residuos no aprovechables.",
    relationship: "El intestino absorbe nutrientes y el hígado los procesa, almacena y distribuye.",
    facts: ["Incluye órganos huecos y sólidos", "Interactúa con el microbioma", "Participa en el metabolismo"],
  },
  {
    id: "urinario",
    name: "Sistema urinario",
    icon: "∞",
    description: "Filtra la sangre y regula el equilibrio de agua, sales y productos de desecho.",
    primaryFunction: "Mantener la composición interna del organismo y formar orina.",
    relationship: "Los riñones filtran y ajustan continuamente el plasma sanguíneo.",
    facts: ["Regula electrolitos", "Participa en el control de la presión", "Contribuye al equilibrio ácido-base"],
  },
  {
    id: "sensorial",
    name: "Sistema sensorial",
    icon: "⊙",
    description: "Capta estímulos del entorno y los convierte en señales interpretables.",
    primaryFunction: "Detectar cambios y aportar información al sistema nervioso.",
    relationship: "El ojo transforma luz en impulsos que el cerebro interpreta como visión.",
    facts: ["Convierte energía física en señales", "Trabaja junto al sistema nervioso", "Permite orientar la conducta"],
  },
  {
    id: "endocrino",
    name: "Sistema endocrino",
    icon: "◈",
    description: "Coordina procesos corporales mediante hormonas liberadas a la sangre.",
    primaryFunction: "Regular metabolismo, crecimiento y equilibrio energético.",
    relationship: "El páncreas integra la digestión con el control hormonal de la glucosa.",
    facts: ["Actúa mediante mensajeros químicos", "Sus efectos pueden ser prolongados", "Mantiene la homeostasis"],
  },
  {
    id: "tegumentario",
    name: "Sistema tegumentario",
    icon: "▦",
    description: "Forma la cubierta protectora del cuerpo y conecta el organismo con el entorno.",
    primaryFunction: "Proteger, percibir estímulos y ayudar a regular la temperatura.",
    relationship: "La piel integra barrera, vasos, nervios, glándulas y tejido subcutáneo.",
    facts: ["Es la barrera externa principal", "Participa en la sensibilidad", "Reduce la pérdida de agua"],
  },
];

export const systemById = Object.fromEntries(anatomySystems.map((system) => [system.id, system]));
