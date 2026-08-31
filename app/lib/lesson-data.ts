import { organs, type Organ, type OrganId } from "./anatomy-data";

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

export function getLessonContent(organ: Organ, module: LessonModule) {
  const structures = organ.hotspots.map((hotspot) => hotspot.label).join(", ");
  const titleByModule: Record<string, string> = {
    introduction: `Introducción a ${organ.name.toLowerCase()}`,
    anatomy: `Anatomía de ${organ.name.toLowerCase()}`,
    function: `Función de ${organ.name.toLowerCase()}`,
    structures: "Estructuras principales",
    clinical: "Importancia clínica",
    review: "Repaso integrado",
    quiz: `Cuestionario de ${organ.name.toLowerCase()}`,
  };
  const contentByModule: Record<string, string[]> = {
    introduction: [organ.description, `Forma parte del ${organ.system.toLowerCase()} y se localiza en: ${organ.location}.`],
    anatomy: [`Su nombre científico es ${organ.scientificName}. ${organ.size} y su peso aproximado es ${organ.weight}.`, `La irrigación depende de: ${organ.bloodSupply}.`],
    function: [`Su función principal es: ${organ.function}.`, organ.dailyFact + "."],
    structures: [`En el modelo 3D puedes identificar: ${structures}.`, `Selecciona los puntos anatómicos para relacionar cada estructura con su función.`],
    clinical: [organ.medical, `Entre las afecciones asociadas se encuentran ${organ.conditions.slice(0, 4).join(", ")}.`],
    review: [`Ubicación: ${organ.location}. Función: ${organ.function}.`, `Irrigación: ${organ.bloodSupply}. Tejido destacado: ${organ.tissue}.`],
    quiz: ["Responde cinco preguntas introductorias y revisa la explicación después de cada respuesta."],
  };
  return {
    title: titleByModule[module.id],
    objectives: [
      `Reconocer la anatomía básica de ${organ.name.toLowerCase()}.`,
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
  const unique = [...new Set(distractors.filter((item) => item !== correct))].slice(0, 3);
  const options = [...unique];
  options.splice(Math.min(position, options.length), 0, correct);
  return { options, correctIndex: options.indexOf(correct) };
}

export function createQuiz(organ: Organ): QuizQuestion[] {
  const otherOrgans = organs.filter((item) => item.id !== organ.id);
  const seed = organs.findIndex((item) => item.id === organ.id);
  const definitions = [
    {
      id: "function",
      prompt: `¿Cuál es la función principal de ${organ.name.toLowerCase()}?`,
      correct: organ.function,
      distractors: otherOrgans.map((item) => item.function),
      explanation: `La función principal es: ${organ.function}.`,
    },
    {
      id: "system",
      prompt: `¿A qué sistema pertenece ${organ.name.toLowerCase()}?`,
      correct: organ.system,
      distractors: otherOrgans.map((item) => item.system),
      explanation: `${organ.name} forma parte del ${organ.system.toLowerCase()}.`,
    },
    {
      id: "location",
      prompt: `¿Dónde se localiza ${organ.name.toLowerCase()}?`,
      correct: organ.location,
      distractors: otherOrgans.map((item) => item.location),
      explanation: `Su ubicación anatómica es: ${organ.location}.`,
    },
    {
      id: "blood",
      prompt: `¿Cuál es la irrigación principal de ${organ.name.toLowerCase()}?`,
      correct: organ.bloodSupply,
      distractors: otherOrgans.map((item) => item.bloodSupply),
      explanation: `La irrigación descrita es: ${organ.bloodSupply}.`,
    },
    {
      id: "size",
      prompt: `¿Qué referencia de tamaño corresponde a ${organ.name.toLowerCase()}?`,
      correct: organ.size,
      distractors: otherOrgans.map((item) => item.size),
      explanation: `${organ.name}: ${organ.size}.`,
    },
  ];

  return definitions.map((item, index) => ({
    id: `${organ.id}-${item.id}`,
    prompt: item.prompt,
    ...choices(item.correct, item.distractors, (seed + index) % 4),
    explanation: item.explanation,
  }));
}
