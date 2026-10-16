import { organPhrase, organs } from "./anatomy-data";

export type GlossaryEntry = { term: string; definition: string };

const coreEntries: GlossaryEntry[] = [
  { term: "Arteria", definition: "Vaso sanguíneo que conduce sangre desde el corazón hacia los tejidos." },
  { term: "Aurícula", definition: "Cada una de las dos cavidades superiores del corazón que reciben sangre." },
  { term: "Bronquio", definition: "Conducto que lleva el aire desde la tráquea hacia los pulmones y se ramifica dentro de ellos." },
  { term: "Corteza", definition: "Capa externa de un órgano con organización y funciones específicas." },
  { term: "Nefrona", definition: "Unidad funcional del riñón, encargada de filtrar la sangre y modificar el filtrado para producir orina." },
  { term: "Vena", definition: "Vaso sanguíneo que devuelve sangre desde los tejidos hacia el corazón." },
  { term: "Ventrículo", definition: "Cada una de las dos cavidades inferiores del corazón que impulsan sangre." },
];

export const glossaryEntries: GlossaryEntry[] = [...coreEntries, ...organs.flatMap((organ) =>
  organ.hotspots.map((hotspot) => ({
    term: hotspot.term ?? hotspot.label,
    definition: `${hotspot.detail}. Estructura identificable en el modelo ${organPhrase(organ, "de")}.`,
  })),
)].filter((entry, index, all) => all.findIndex((item) => item.term.toLowerCase() === entry.term.toLowerCase()) === index)
  .sort((a, b) => a.term.localeCompare(b.term, "es"));
