import type { OrganId } from "./anatomy-data";

export type OrganResource = {
  title: string;
  authors?: string;
  /** Book, publisher or journal. */
  source: string;
  year?: string;
  url: string;
  language: "es" | "en";
  /** Full text openly available. */
  free: boolean;
};

export type OrganResources = { books: OrganResource[]; papers: OrganResource[] };

export function resourceMeta(item: OrganResource) {
  return [item.authors, item.source, item.year].filter(Boolean).join(" · ");
}

// Links checked against the publisher, journal or repository page. Papers are open access.
export const organResources: Record<OrganId, OrganResources> = {
  heart: {
    books: [
      { title: "19.1: Anatomía del corazón (traducción parcial)", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_4%3A_Fluidos_y_Transporte/19%3A_El_Sistema_Cardiovascular_-_El_Coraz%C3%B3n/19.01%3A_Anatom%C3%ADa_del_coraz%C3%B3n", language: "es", free: true },
      { title: "Anatomía humana descriptiva, topográfica y funcional. Tomo 2: Tronco", authors: "Rouvière y Delmas", source: "Elsevier Masson · 11.ª ed. · Corazón y vasos del tronco", year: "2005", url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-2-tronco/rouviere/978-84-458-1314-0", language: "es", free: false },
      { title: "Anatomía con orientación clínica", authors: "Moore, Dalley y Agur", source: "Wolters Kluwer · 9.ª ed. · Tórax", year: "2022", url: "https://shop.lww.com/p/9788418892745", language: "es", free: false },
      { title: "19.1 Heart Anatomy", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", language: "en", free: true },
    ],
    papers: [
      { title: "Determinación de la dominancia coronaria en población mestiza colombiana: un estudio anatómico directo", authors: "Ballesteros Acuña et al.", source: "International Journal of Morphology 25(3)", year: "2007", url: "https://doi.org/10.4067/S0717-95022007000300003", language: "es", free: true },
      { title: "Cardiac anatomy revisited", authors: "Anderson et al.", source: "Journal of Anatomy 205(3)", year: "2004", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1571338/", language: "en", free: true },
      { title: "Anatomy, Thorax, Heart", authors: "Rehman y Rehman", source: "StatPearls · NCBI Bookshelf", year: "2023", url: "https://www.ncbi.nlm.nih.gov/books/NBK470256/", language: "en", free: true },
    ],
  },
  brain: {
    books: [
      { title: "13.2: El sistema nervioso central (sección «El cerebro»)", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_3%3A_Regulaci%C3%B3n%2C_Integraci%C3%B3n_y_Control/13%3A_Anatom%C3%ADa_del_Tejido_Nervioso/13.02%3A_El_Sistema_Nervioso_Central", language: "es", free: true },
      { title: "Anatomía humana descriptiva, topográfica y funcional. Tomo 4: Sistema nervioso central, vías y centros nerviosos", authors: "Rouvière y Delmas", source: "Elsevier Masson · 11.ª ed. · Vías y centros nerviosos", year: "2005", url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-4-sistema-nervioso-central-vias-y-centros-nerviosos/rouviere/978-84-458-1316-4", language: "es", free: false },
      { title: "Snell. Neuroanatomía clínica", authors: "Splittgerber", source: "Wolters Kluwer · 9.ª ed.", year: "2025", url: "https://shop.lww.com/Snell--Neuroanatom-a-cl-nica/p/9788410022461", language: "es", free: false },
      { title: "13.2 The Central Nervous System", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system", language: "en", free: true },
    ],
    papers: [
      { title: "Los giros del lóbulo frontal: estudio postmortem", authors: "Merlo et al.", source: "Revista Chilena de Anatomía 17(2)", year: "1999", url: "https://doi.org/10.4067/S0716-98681999000200008", language: "es", free: true },
      { title: "Evaluación morfológica y variaciones del círculo arterial cerebral: un estudio con material cadavérico en una muestra de población colombiana", authors: "Ballesteros-Acuña et al.", source: "International Journal of Morphology 39(5)", year: "2021", url: "https://doi.org/10.4067/S0717-95022021000501453", language: "es", free: true },
      { title: "Neuroanatomy, Cerebral Hemisphere", authors: "Bui y Das", source: "StatPearls · NCBI Bookshelf", year: "2023", url: "https://www.ncbi.nlm.nih.gov/books/NBK549789/", language: "en", free: true },
    ],
  },
  lungs: {
    books: [
      { title: "22.2: Los pulmones", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_5%3A_Energ%C3%ADa%2C_Mantenimiento_e_Intercambio_Ambiental/22%3A_El_Sistema_Respiratorio/22.02%3A_Los_pulmones", language: "es", free: true },
      { title: "Anatomía humana descriptiva, topográfica y funcional. Tomo 2: Tronco", authors: "Rouvière y Delmas", source: "Elsevier Masson · 11.ª ed. · Tórax y vísceras torácicas", year: "2005", url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-2-tronco/rouviere/978-84-458-1314-0", language: "es", free: false },
      { title: "Anatomía con orientación clínica", authors: "Moore, Dalley y Agur", source: "Wolters Kluwer · 9.ª ed. · Tórax", year: "2022", url: "https://shop.lww.com/p/9788418892745", language: "es", free: false },
      { title: "22.2 The Lungs", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-2-the-lungs", language: "en", free: true },
    ],
    papers: [
      { title: "Bronquio cardíaco accesorio y otras variantes de la anatomía tráqueo-bronquial", authors: "Palavecino y Palma", source: "Revista Chilena de Enfermedades Respiratorias 33(2)", year: "2017", url: "https://doi.org/10.4067/s0717-73482017000200131", language: "es", free: true },
      { title: "Lung Structure and the Intrinsic Challenges of Gas Exchange", authors: "Hsia et al.", source: "Comprehensive Physiology 6(2)", year: "2016", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5026132/", language: "en", free: true },
      { title: "Anatomy, Thorax, Lungs", authors: "Chaudhry et al.", source: "StatPearls · NCBI Bookshelf", year: "2024", url: "https://www.ncbi.nlm.nih.gov/books/NBK470197/", language: "en", free: true },
    ],
  },
  liver: {
    books: [
      { title: "23.6: Órganos accesorios en la digestión: el hígado, el páncreas y la vesícula", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_5%3A_Energ%C3%ADa%2C_Mantenimiento_e_Intercambio_Ambiental/23%3A_El_Sistema_Digestivo/23.06%3A_%C3%93rganos_Accesorios_en_la_Digesti%C3%B3n-_El_H%C3%ADgado%2C_P%C3%A1ncreas_y_Ves%C3%ADcula", language: "es", free: true },
      { title: "Anatomía humana descriptiva, topográfica y funcional. Tomo 2: Tronco", authors: "Rouvière y Delmas", source: "Elsevier Masson · 11.ª ed. · Órganos abdominales", year: "2005", url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-2-tronco/rouviere/978-84-458-1314-0", language: "es", free: false },
      { title: "Gray. Anatomía para estudiantes", authors: "Drake, Vogl y Mitchell", source: "Elsevier · 5.ª ed. · Abdomen", year: "2024", url: "https://shop.elsevier.com/books/gray-anatomia-para-estudiantes/drake/978-84-1382-622-6", language: "es", free: false },
      { title: "23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", language: "en", free: true },
    ],
    papers: [
      { title: "Anatomía quirúrgica y radiológica del hígado: fundamentos para las resecciones hepáticas", authors: "Manterola et al.", source: "International Journal of Morphology 35(4)", year: "2017", url: "https://doi.org/10.4067/S0717-95022017000401525", language: "es", free: true },
      { title: "Liver Anatomy", authors: "Abdel-Misih y Bloomston", source: "Surgical Clinics of North America 90(4)", year: "2010", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4038911/", language: "en", free: true },
      { title: "Anatomy, Abdomen and Pelvis: Liver", authors: "Vernon et al.", source: "StatPearls · NCBI Bookshelf", year: "2022", url: "https://www.ncbi.nlm.nih.gov/books/NBK500014/", language: "en", free: true },
    ],
  },
  kidneys: {
    books: [
      { title: "25.3: Anatomía macroscópica del riñón", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_5%3A_Energ%C3%ADa%2C_Mantenimiento_e_Intercambio_Ambiental/25%3A_El_Sistema_Urinario/25.03%3A_Anatom%C3%ADa_macrosc%C3%B3pica_del_ri%C3%B1%C3%B3n", language: "es", free: true },
      { title: "Anatomía humana descriptiva, topográfica y funcional. Tomo 2: Tronco", authors: "Rouvière y Delmas", source: "Elsevier Masson · 11.ª ed. · Región lumbar y aparato urinario", year: "2005", url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-2-tronco/rouviere/978-84-458-1314-0", language: "es", free: false },
      { title: "Anatomía con orientación clínica", authors: "Moore, Dalley y Agur", source: "Wolters Kluwer · 9.ª ed. · Abdomen", year: "2022", url: "https://shop.lww.com/p/9788418892745", language: "es", free: false },
      { title: "25.3 Gross Anatomy of the Kidney", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/25-3-gross-anatomy-of-the-kidney", language: "en", free: true },
    ],
    papers: [
      { title: "Implicaciones clínicas y quirúrgicas de las variaciones anatómicas vasculares del riñón", authors: "Aldana et al.", source: "Revista Ciencias de la Salud 8(2)", year: "2010", url: "http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S1692-72732010000200006", language: "es", free: true },
      { title: "A Literature Review of Renal Surgical Anatomy and Surgical Strategies for Partial Nephrectomy", authors: "Klatte et al.", source: "European Urology 68(6)", year: "2015", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4994971/", language: "en", free: true },
      { title: "Anatomy, Abdomen and Pelvis: Kidneys", authors: "Garza y Leslie", source: "StatPearls · NCBI Bookshelf", year: "2025", url: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", language: "en", free: true },
    ],
  },
  eyeball: {
    books: [
      { title: "14.1: Percepción sensorial (sección «Visión»)", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_3%3A_Regulaci%C3%B3n%2C_Integraci%C3%B3n_y_Control/14%3A_El_sistema_nervioso_som%C3%A1tico/14.01%3A_Percepci%C3%B3n_Sensorial", language: "es", free: true },
      { title: "Anatomía humana descriptiva, topográfica y funcional. Tomo 1: Cabeza y cuello", authors: "Rouvière y Delmas", source: "Elsevier Masson · 11.ª ed. · Órganos de los sentidos", year: "2005", url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-1-cabeza-y-cuello/rouviere/978-84-458-1313-3", language: "es", free: false },
      { title: "Anatomía con orientación clínica", authors: "Moore, Dalley y Agur", source: "Wolters Kluwer · 9.ª ed. · Cabeza y órbita", year: "2022", url: "https://shop.lww.com/p/9788418892745", language: "es", free: false },
      { title: "14.1 Sensory Perception (section “Vision”)", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/14-1-sensory-perception", language: "en", free: true },
    ],
    papers: [
      { title: "Variación de la ratio longitud axial/radio corneal (LA/RC) con el estado refractivo ocular: relación con los componentes oculares", authors: "Yebra-Pimentel et al.", source: "Archivos de la Sociedad Española de Oftalmología 79(7)", year: "2004", url: "https://doi.org/10.4321/s0365-66912004000700004", language: "es", free: true },
      { title: "Anatomy of cornea and ocular surface", authors: "Sridhar", source: "Indian Journal of Ophthalmology 66(2)", year: "2018", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5819093/", language: "en", free: true },
      { title: "Anatomy, Head and Neck, Eye", authors: "Rehman et al.", source: "StatPearls · NCBI Bookshelf", year: "2023", url: "https://www.ncbi.nlm.nih.gov/books/NBK482428/", language: "en", free: true },
    ],
  },
  intestine: {
    books: [
      { title: "23.5: El intestino delgado y grueso", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_5%3A_Energ%C3%ADa%2C_Mantenimiento_e_Intercambio_Ambiental/23%3A_El_Sistema_Digestivo/23.05%3A_El_intestino_delgado_y_grueso", language: "es", free: true },
      { title: "Anatomía humana descriptiva, topográfica y funcional. Tomo 2: Tronco", authors: "Rouvière y Delmas", source: "Elsevier Masson · 11.ª ed. · Órganos abdominales", year: "2005", url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-2-tronco/rouviere/978-84-458-1314-0", language: "es", free: false },
      { title: "Anatomía con orientación clínica", authors: "Moore, Dalley y Agur", source: "Wolters Kluwer · 9.ª ed. · Abdomen", year: "2022", url: "https://shop.lww.com/p/9788418892745", language: "es", free: false },
      { title: "23.5 The Small and Large Intestines", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", language: "en", free: true },
    ],
    papers: [
      { title: "Consideraciones anatómicas sobre la irrigación de la flexura cólica derecha", authors: "Buarque de Gusmão et al.", source: "International Journal of Morphology 26(2)", year: "2008", url: "https://doi.org/10.4067/S0717-95022008000200029", language: "es", free: true },
      { title: "Surgical Anatomy of the Superior Mesenteric Vessels Related to Colon and Pancreatic Surgery: A Systematic Review and Meta-Analysis", authors: "Negoi et al.", source: "Scientific Reports 8", year: "2018", url: "https://doi.org/10.1038/s41598-018-22641-x", language: "en", free: true },
      { title: "Anatomy, Abdomen and Pelvis, Small Intestine", authors: "Collins et al.", source: "StatPearls · NCBI Bookshelf", year: "2025", url: "https://www.ncbi.nlm.nih.gov/books/NBK459366/", language: "en", free: true },
    ],
  },
  pancreas: {
    books: [
      { title: "23.6: Órganos accesorios en la digestión: el hígado, el páncreas y la vesícula", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_5%3A_Energ%C3%ADa%2C_Mantenimiento_e_Intercambio_Ambiental/23%3A_El_Sistema_Digestivo/23.06%3A_%C3%93rganos_Accesorios_en_la_Digesti%C3%B3n-_El_H%C3%ADgado%2C_P%C3%A1ncreas_y_Ves%C3%ADcula", language: "es", free: true },
      { title: "17.9: El páncreas endocrino", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_3%3A_Regulaci%C3%B3n%2C_Integraci%C3%B3n_y_Control/17%3A_El_sistema_endocrino/17.09%3A_El_P%C3%A1ncreas_Endocrino", language: "es", free: true },
      { title: "Anatomía humana descriptiva, topográfica y funcional. Tomo 2: Tronco", authors: "Rouvière y Delmas", source: "Elsevier Masson · 11.ª ed. · Órganos abdominales", year: "2005", url: "https://tienda.elsevier.com/books/anatomia-humana-descriptiva-topografica-y-funcional-tomo-2-tronco/rouviere/978-84-458-1314-0", language: "es", free: false },
      { title: "Gray. Anatomía para estudiantes", authors: "Drake, Vogl y Mitchell", source: "Elsevier · 5.ª ed. · Abdomen", year: "2024", url: "https://shop.elsevier.com/books/gray-anatomia-para-estudiantes/drake/978-84-1382-622-6", language: "es", free: false },
      { title: "23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", language: "en", free: true },
      { title: "17.9 The Endocrine Pancreas", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-9-the-endocrine-pancreas", language: "en", free: true },
    ],
    papers: [
      { title: "Diagnóstico por imágenes en las anomalías del desarrollo del páncreas", authors: "Haberman et al.", source: "Acta Gastroenterológica Latinoamericana 55(1)", year: "2025", url: "https://doi.org/10.52787/agl.v55i1.462", language: "es", free: true },
      { title: "The Blood Supply of the Human Pancreas: Anatomical and Surgical Considerations", authors: "Triantafyllou et al.", source: "Journal of Clinical Medicine 14(16)", year: "2025", url: "https://doi.org/10.3390/jcm14165625", language: "en", free: true },
      { title: "Anatomy, Abdomen and Pelvis, Pancreas", authors: "Talathi et al.", source: "StatPearls · NCBI Bookshelf", year: "2025", url: "https://www.ncbi.nlm.nih.gov/books/NBK532912/", language: "en", free: true },
    ],
  },
  skin: {
    books: [
      { title: "5.1: Capas de la piel (traducción parcial)", source: "Anatomía y Fisiología (OpenStax) · LibreTexts Español", url: "https://espanol.libretexts.org/Bookshelves/Salud/Anatomia_y_Fisiologia/Libro%3A_Anatom%C3%ADa_y_Fisiolog%C3%ADa_1e_(OpenStax)/Unit_2%3A_Apoyo_y_Movimiento/05%3A_El_sistema_integumentario/5.01%3A_Capas_de_la_piel", language: "es", free: true },
      { title: "Anatomía con orientación clínica", authors: "Moore, Dalley y Agur", source: "Wolters Kluwer · 9.ª ed. · Introducción: sistema tegumentario", year: "2022", url: "https://shop.lww.com/p/9788418892745", language: "es", free: false },
      { title: "5.1 Layers of the Skin", source: "Anatomy and Physiology 2e · OpenStax", year: "2022", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/5-1-layers-of-the-skin", language: "en", free: true },
    ],
    papers: [
      { title: "Desarrollo de la piel y sus anexos en vertebrados", authors: "Meruane y Rojas", source: "International Journal of Morphology 30(4)", year: "2012", url: "https://doi.org/10.4067/S0717-95022012000400025", language: "es", free: true },
      { title: "Skin Structure–Function Relationships and the Wound Healing Response to Intrinsic Aging", authors: "Blair et al.", source: "Advances in Wound Care 9(3)", year: "2020", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6985772/", language: "en", free: true },
      { title: "Anatomy, Skin (Integument), Epidermis", authors: "Yousef et al.", source: "StatPearls · NCBI Bookshelf", year: "2024", url: "https://www.ncbi.nlm.nih.gov/books/NBK470464/", language: "en", free: true },
    ],
  },
};
