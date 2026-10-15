export type AnatomyBook = {
  title: string;
  authors: string;
  publisher: string;
  edition?: string;
  url: string;
  /** Free, legally open full text rather than a publisher's store page. */
  free?: boolean;
};

// Publisher pages and official open editions only — no unofficial PDF copies.
export const anatomyBooks: AnatomyBook[] = [
  {
    title: "Anatomía humana (Colección Latarjet, 2 tomos)",
    authors: "Michel Latarjet, Alfredo Ruiz Liard",
    publisher: "Editorial Médica Panamericana",
    edition: "5.ª ed. · 2019",
    url: "https://www.medicapanamericana.com/es-PE/libros/coleccion-latarjet-anatomia-humana-2-tomos-2-tomos-5a-edicion",
  },
  {
    title: "Anatomía humana descriptiva, topográfica y funcional · Tomo 1",
    authors: "Henri Rouvière, André Delmas, Vincent Delmas",
    publisher: "Elsevier Masson",
    edition: "11.ª ed. · 2005",
    url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-1-cabeza-y-cuello/rouviere/978-84-458-1313-3",
  },
  {
    title: "Netter. Atlas de anatomía humana. Abordaje regional",
    authors: "Frank H. Netter",
    publisher: "Elsevier",
    edition: "8.ª ed. · 2023",
    url: "https://shop.elsevier.com/books/netter-atlas-de-anatomia-humana-abordaje-regional/netter/978-84-1382-398-0",
  },
  {
    title: "Moore. Anatomía con orientación clínica",
    authors: "Keith L. Moore, Arthur F. Dalley II, Anne M. R. Agur",
    publisher: "Wolters Kluwer",
    edition: "9.ª ed. · 2022",
    url: "https://shop.lww.com/p/9788418892745",
  },
  {
    title: "Gray. Anatomía para estudiantes",
    authors: "Richard Drake, A. Wayne Vogl, Adam W. M. Mitchell",
    publisher: "Elsevier",
    edition: "5.ª ed. · 2024",
    url: "https://shop.elsevier.com/books/gray-anatomia-para-estudiantes/drake/978-84-1382-622-6",
  },
  {
    title: "Sobotta. Atlas de anatomía humana · Vol. 1",
    authors: "Friedrich Paulsen, Jens Waschke",
    publisher: "Elsevier",
    edition: "25.ª ed. · 2024",
    url: "https://shop.elsevier.com/books/sobotta-atlas-de-anatomia-humana-vol-1/paulsen/978-84-1382-630-1",
  },
  {
    title: "Prometheus. Atlas de anatomía",
    authors: "Anne M. Gilroy",
    publisher: "Editorial Médica Panamericana",
    edition: "4.ª ed. · 2022",
    url: "https://www.medicapanamericana.com/es-PE/libros/prometheus-atlas-de-anatomia-4a-edicion",
  },
  {
    title: "Principios de anatomía y fisiología",
    authors: "Gerard J. Tortora, Bryan Derrickson",
    publisher: "Editorial Médica Panamericana",
    edition: "15.ª ed. · 2018",
    url: "https://www.medicapanamericana.com/es-PE/libros/principios-de-anatomia-y-fisiologia-15a-edicion",
  },
  {
    title: "Anatomía y fisiología",
    authors: "OpenStax (traducción en LibreTexts Español)",
    publisher: "LibreTexts",
    edition: "1.ª ed.",
    url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)",
    free: true,
  },
  {
    title: "Anatomy and Physiology (en inglés)",
    authors: "J. Gordon Betts et al.",
    publisher: "OpenStax · Rice University",
    edition: "2.ª ed. · 2022",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
    free: true,
  },
  {
    title: "Anatomy of the Human Body — Gray's Anatomy (en inglés)",
    authors: "Henry Gray",
    publisher: "Bartleby.com",
    edition: "20.ª ed. · 1918",
    url: "https://www.bartleby.com/lit-hub/anatomy-of-the-human-body/",
    free: true,
  },
];
