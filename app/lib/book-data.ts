export type AnatomyBook = {
  title: string;
  /** Original title, retained for reference and search when the display title is translated. */
  originalTitle?: string;
  authors: string;
  publisher: string;
  edition?: string;
  url: string;
  /** Full text accessible for reading. This flag does not grant reproduction or redistribution rights. */
  free: true;
};

// Only verified free online editions — no store pages or unofficial PDF copies.
export const anatomyBooks: AnatomyBook[] = [
  {
    title: "Anatomía y fisiología",
    authors: "OpenStax (traducción en LibreTexts Español)",
    publisher: "LibreTexts",
    edition: "1.ª ed.",
    url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)",
    free: true,
  },
  {
    title: "Anatomía y fisiología (obra en inglés)", originalTitle: "Anatomy and Physiology (en inglés)",
    authors: "J. Gordon Betts et al.",
    publisher: "OpenStax · Rice University",
    edition: "2.ª ed. · 2022",
    url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction",
    free: true,
  },
];
