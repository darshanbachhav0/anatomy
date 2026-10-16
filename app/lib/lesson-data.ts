import { isPluralOrgan, organPhrase, organs, type Organ, type OrganId } from "./anatomy-data";

export type LessonModule = {
  id: string;
  number: string;
  label: string;
};

export const lessonModules: LessonModule[] = [
  { id: "introduction", number: "01", label: "Introducción" },
  { id: "anatomy", number: "02", label: "Anatomía" },
  { id: "function", number: "03", label: "Función" },
  { id: "structures", number: "04", label: "Estructuras principales" },
  { id: "clinical", number: "05", label: "Importancia clínica" },
  { id: "review", number: "06", label: "Repaso" },
  { id: "quiz", number: "07", label: "Cuestionario" },
];

export function lessonKey(organId: OrganId, moduleId: string) {
  return `${organId}:${moduleId}`;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
// Lowercases a term inside a sentence, but keeps acronyms such as "EPOC".
const inSentence = (term: string) => (/^\p{Lu}{2}/u.test(term) ? term : term.charAt(0).toLowerCase() + term.slice(1));
const listJoin = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} y ${items.at(-1)}` : items.join(""));

export function getLessonContent(organ: Organ, module: LessonModule) {
  const structures = listJoin(organ.hotspots.map((hotspot) => inSentence(hotspot.label)));
  const subject = capitalize(organPhrase(organ));
  const titleByModule: Record<string, string> = {
    introduction: `Introducción ${organPhrase(organ, "a")}`,
    anatomy: `Anatomía ${organPhrase(organ, "de")}`,
    function: `Función ${organPhrase(organ, "de")}`,
    structures: "Estructuras principales",
    clinical: "Importancia clínica",
    review: "Repaso integrado",
    quiz: `Cuestionario ${organPhrase(organ, "de")}`,
  };
  const contentByModule: Record<string, string[]> = {
    introduction: [organ.description, `${subject} ${isPluralOrgan(organ) ? "forman" : "forma"} parte del ${organ.system.toLowerCase()}.`, `Ubicación: ${organ.location}`],
    anatomy: [`Nombre en la terminología anatómica latina: ${organ.scientificName}.`, `Tamaño: ${organ.size}`, `Peso: ${organ.weight}`, `Irrigación: ${organ.bloodSupply}`, `Inervación: ${organ.innervation}`, `Vascularización: ${organ.venousDrainage}`],
    function: [`Función: ${organ.function}`, `Cada día: ${organ.dailyFact}`],
    structures: [`Estructuras que puedes reconocer en el modelo 3D: ${structures}.`, "En la pestaña Explorar, gira el modelo y usa las herramientas Corte y Capas para observar su forma y su organización."],
    clinical: [organ.medical, `Afecciones asociadas: ${listJoin(organ.conditions.map(inSentence))}.`],
    review: [`Ubicación: ${organ.summary.location}. Función: ${organ.summary.function}. Irrigación: ${organ.summary.bloodSupply}.`, `Referencia: ${organ.references}`],
    quiz: ["Responde cinco preguntas introductorias y revisa la explicación después de cada respuesta."],
  };
  return {
    title: titleByModule[module.id],
    objectives: [
      `Reconocer la anatomía básica ${organPhrase(organ, "de")}.`,
      "Relacionar estructura, ubicación y función.",
      "Aplicar los conceptos en el modelo tridimensional.",
    ],
    paragraphs: contentByModule[module.id],
    facts: [organ.funFact, organ.medical],
  };
}

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

function choices(correct: string, distractors: string[], position: number) {
  // A distractor that contains the answer (or is contained in it) would also be partly right,
  // e.g. "Sistema digestivo" for the pancreas, which belongs to the digestive and endocrine systems.
  const overlaps = (item: string) => item.toLowerCase().includes(correct.toLowerCase()) || correct.toLowerCase().includes(item.toLowerCase());
  const unique = [...new Set(distractors.filter((item) => !overlaps(item)))].slice(0, 3);
  const options = [...unique];
  options.splice(Math.min(position, options.length), 0, correct);
  return { options, correctIndex: options.indexOf(correct) };
}

export function createQuiz(organ: Organ): QuizQuestion[] {
  const otherOrgans = organs.filter((item) => item.id !== organ.id);
  const seed = organs.findIndex((item) => item.id === organ.id);
  const plural = isPluralOrgan(organ);
  // Options use the short summaries; the explanation gives the full course text.
  const definitions = [
    {
      id: "function",
      prompt: `¿Cuál es la función principal ${organPhrase(organ, "de")}?`,
      correct: organ.summary.function,
      distractors: otherOrgans.map((item) => item.summary.function),
      explanation: `Función: ${organ.function}`,
    },
    {
      id: "system",
      prompt: `¿A qué sistema ${plural ? "pertenecen" : "pertenece"} ${organPhrase(organ)}?`,
      correct: organ.system,
      distractors: otherOrgans.map((item) => item.system),
      explanation: `${capitalize(organPhrase(organ))} ${plural ? "forman" : "forma"} parte del ${organ.system.toLowerCase()}.`,
    },
    {
      id: "location",
      prompt: `¿Dónde se ${plural ? "localizan" : "localiza"} ${organPhrase(organ)}?`,
      correct: organ.summary.location,
      distractors: otherOrgans.map((item) => item.summary.location),
      explanation: `Ubicación: ${organ.location}`,
    },
    {
      id: "blood",
      prompt: `¿Cuál es la irrigación principal ${organPhrase(organ, "de")}?`,
      correct: organ.summary.bloodSupply,
      distractors: otherOrgans.map((item) => item.summary.bloodSupply),
      explanation: `Irrigación: ${organ.bloodSupply}`,
    },
    {
      id: "size",
      prompt: `¿Qué medida corresponde ${organPhrase(organ, "a")}?`,
      correct: organ.summary.size,
      distractors: otherOrgans.map((item) => item.summary.size),
      explanation: `Tamaño: ${organ.size}`,
    },
  ];

  return definitions.map((item, index) => ({
    id: `${organ.id}-${item.id}`,
    prompt: item.prompt,
    ...choices(item.correct, item.distractors, (seed + index) % 4),
    explanation: item.explanation,
  }));
}
