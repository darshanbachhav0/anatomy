import { organs } from "./anatomy-data";

export type GlossaryEntry = { term: string; definition: string };

const coreEntries: GlossaryEntry[] = [
  { term: "Arteria", definition: "Vaso sanguíneo que conduce sangre desde el corazón hacia los tejidos." },
  { term: "Aurícula", definition: "Cada una de las dos cavidades superiores del corazón que reciben sangre." },
  { term: "Bronquio", definition: "Conducto que lleva aire desde la tráquea hacia los pulmones." },
  { term: "Corteza", definition: "Capa externa de un órgano con organización y funciones específicas." },
  { term: "Nefrona", definition: "Unidad microscópica funcional del riñón encargada de filtrar y ajustar el líquido corporal." },
  { term: "Vena", definition: "Vaso sanguíneo que devuelve sangre desde los tejidos hacia el corazón." },
  { term: "Ventrículo", definition: "Cada una de las dos cavidades inferiores del corazón que impulsan sangre." },
];

export const glossaryEntries: GlossaryEntry[] = [...coreEntries, ...organs.flatMap((organ) =>
  organ.hotspots.map((hotspot) => ({
    term: hotspot.label,
    definition: `${hotspot.detail}. Estructura identificable en el modelo de ${organ.name.toLowerCase()}.`,
  })),
)].filter((entry, index, all) => all.findIndex((item) => item.term.toLowerCase() === entry.term.toLowerCase()) === index)
  .sort((a, b) => a.term.localeCompare(b.term, "es"));
