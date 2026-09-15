import type { Atlas, Concept, Part, SceneState, SystemId } from './anatomy';
export const ORGAN_SYSTEMS: SystemId[] = ['cardiac', 'respiratory', 'digestive', 'urinary', 'endocrine', 'reproductive'];
export const HEART_WALLS = ['FJ2428', 'FJ2438', 'FJ2439'];
export const HEART_CAVITIES = ['FJ2422', 'FJ2423', 'FJ2424', 'FJ2425'];
export const INITIAL_STATE: SceneState = {
    explode: 0, visible: ['skeletal', 'muscular', 'cardiac', 'sensory', 'arterial', 'venous', 'nervous', 'respiratory', 'digestive', 'urinary', 'lymphatic', 'endocrine', 'reproductive', 'connective'],
    selected: [], hidden: [], scope: null, isolate: false, view: 'three-quarter', rotate: false, reset: 0, focus: 0, zoom: 0,
};
export function visibleParts(atlas: Atlas, state: SceneState): Part[] {
    const hidden = new Set(state.hidden), selected = new Set(state.selected), systems = new Set(state.visible);
    const scope = state.scope ? new Set(state.scope) : null;
    return atlas.parts.filter(part => !hidden.has(part.id) && (!scope || scope.has(part.id)) &&
        (state.isolate ? selected.has(part.id) : systems.has(part.system) || selected.has(part.id)));
}
export type VisibilityHistory = {
    past: string[][];
    present: string[];
    future: string[][];
};
export const EMPTY_HISTORY: VisibilityHistory = { past: [], present: [], future: [] };
export function changeHidden(history: VisibilityHistory, hidden: string[]): VisibilityHistory {
    const next = [...new Set(hidden)];
    if (next.length === history.present.length && next.every(id => history.present.includes(id)))
        return history;
    return { past: [...history.past.slice(-49), history.present], present: next, future: [] };
}
export function undoHidden(history: VisibilityHistory): VisibilityHistory {
    if (!history.past.length)
        return history;
    return { past: history.past.slice(0, -1), present: history.past[history.past.length - 1], future: [history.present, ...history.future] };
}
export function redoHidden(history: VisibilityHistory): VisibilityHistory {
    if (!history.future.length)
        return history;
    return { past: [...history.past, history.present], present: history.future[0], future: history.future.slice(1) };
}
// Exact educational labels. Untranslated specialized terms keep their original
// source name visibly identified; IDs and original names always remain searchable.
const LABELS: Record<string, string> = {
    heart: 'Corazón', brain: 'Encéfalo', liver: 'Hígado', stomach: 'Estómago', spleen: 'Bazo', pancreas: 'Páncreas',
    kidney: 'Riñones', 'right kidney': 'Riñón derecho', 'left kidney': 'Riñón izquierdo',
    'urinary bladder': 'Vejiga urinaria', trachea: 'Tráquea', diaphragm: 'Diafragma', lung: 'Pulmones', lungs: 'Pulmones',
    'right lung': 'Pulmón derecho', 'left lung': 'Pulmón izquierdo', 'small intestine': 'Intestino delgado',
    'large intestine': 'Intestino grueso', intestine: 'Intestino', esophagus: 'Esófago', duodenum: 'Duodeno',
    jejunum: 'Yeyuno', ileum: 'Íleon', colon: 'Colon', cecum: 'Ciego', rectum: 'Recto', gallbladder: 'Vesícula biliar',
    'ascending colon': 'Colon ascendente', 'descending colon': 'Colon descendente', 'transverse colon': 'Colon transverso',
    'sigmoid colon': 'Colon sigmoide', appendix: 'Apéndice', tongue: 'Lengua', larynx: 'Laringe', pharynx: 'Faringe',
    'thyroid gland': 'Glándula tiroides', 'pituitary gland': 'Hipófisis', 'pineal gland': 'Glándula pineal', thymus: 'Timo',
    'spinal cord': 'Médula espinal', cerebellum: 'Cerebelo', brainstem: 'Tronco encefálico', pons: 'Puente',
    'medulla oblongata': 'Bulbo raquídeo', midbrain: 'Mesencéfalo', hypothalamus: 'Hipotálamo', thalamus: 'Tálamo',
    'third ventricle': 'Tercer ventrículo cerebral', 'fourth ventricle': 'Cuarto ventrículo cerebral',
    'interventricular foramen': 'Foramen interventricular cerebral', 'left lateral ventricle': 'Ventrículo lateral izquierdo',
    'right lateral ventricle': 'Ventrículo lateral derecho', 'corpus callosum': 'Cuerpo calloso',
    'mitral valve': 'Válvula mitral', 'tricuspid valve': 'Válvula tricúspide', 'aortic valve': 'Válvula aórtica',
    'pulmonary valve': 'Válvula pulmonar', 'left atrium': 'Aurícula izquierda', 'right atrium': 'Aurícula derecha',
    'left ventricle': 'Ventrículo izquierdo', 'right ventricle': 'Ventrículo derecho',
    'wall of ventricle': 'Pared ventricular', 'wall of left ventricle': 'Pared del ventrículo izquierdo',
    'wall of right ventricle': 'Pared del ventrículo derecho', 'wall of cardiac chamber': 'Paredes de las cámaras cardíacas',
    'wall of atrium': 'Paredes auriculares', 'wall of left atrium': 'Pared de la aurícula izquierda',
    'wall of right atrium': 'Pared de la aurícula derecha',
    'cavity of left ventricle': 'Cavidad del ventrículo izquierdo', 'cavity of right ventricle': 'Cavidad del ventrículo derecho',
    'cavity of left atrium': 'Cavidad de la aurícula izquierda', 'cavity of right atrium': 'Cavidad de la aurícula derecha',
    'anterior leaflet of mitral valve': 'Valva anterior de la válvula mitral',
    'posterior leaflet of mitral valve': 'Valva posterior de la válvula mitral',
    'anterior leaflet of tricuspid valve': 'Valva anterior de la válvula tricúspide',
    'posterior leaflet of tricuspid valve': 'Valva posterior de la válvula tricúspide',
    'septal leaflet of tricuspid valve': 'Valva septal de la válvula tricúspide',
    'left anterior cusp of pulmonary valve': 'Valva anterior izquierda de la válvula pulmonar',
    'right anterior cusp of pulmonary valve': 'Valva anterior derecha de la válvula pulmonar',
    'posterior cusp of pulmonary valve': 'Valva posterior de la válvula pulmonar',
    'left posterior cusp of aortic valve': 'Valva posterior izquierda de la válvula aórtica',
    'right posterior cusp of aortic valve': 'Valva posterior derecha de la válvula aórtica',
    'anterior cusp of aortic valve': 'Valva anterior de la válvula aórtica',
    'anterolateral head of lateral papillary muscle of left ventricle': 'Cabeza anterolateral del músculo papilar lateral del ventrículo izquierdo',
    'lateral papillary muscle of left ventricle': 'Músculo papilar lateral del ventrículo izquierdo',
    'anterior papillary muscle of right ventricle': 'Músculo papilar anterior del ventrículo derecho',
    'posterior papillary muscle of right ventricle': 'Músculo papilar posterior del ventrículo derecho',
    'septal papillary muscle of right ventricle': 'Músculo papilar septal del ventrículo derecho',
    'vascular tree': 'Árbol vascular', aorta: 'Aorta', 'ascending aorta': 'Aorta ascendente', 'arch of aorta': 'Arco aórtico',
    'descending aorta': 'Aorta descendente', 'abdominal aorta': 'Aorta abdominal', 'thoracic aorta': 'Aorta torácica',
    'pulmonary trunk': 'Tronco pulmonar', 'superior vena cava': 'Vena cava superior', 'inferior vena cava': 'Vena cava inferior',
    'right coronary artery': 'Arteria coronaria derecha', 'left coronary artery': 'Arteria coronaria izquierda',
    'coronary sinus': 'Seno coronario', 'portal vein': 'Vena porta', 'hepatic portal vein': 'Vena porta hepática',
    skeleton: 'Esqueleto', skull: 'Cráneo', cranium: 'Cráneo', mandible: 'Mandíbula', sternum: 'Esternón',
    sacrum: 'Sacro', coccyx: 'Cóccix', 'vertebral column': 'Columna vertebral', 'hyoid bone': 'Hueso hioides',
    'frontal bone': 'Hueso frontal', 'occipital bone': 'Hueso occipital', 'sphenoid bone': 'Hueso esfenoides',
    'ethmoid bone': 'Hueso etmoides', vomer: 'Vómer', pelvis: 'Pelvis',
    skin: 'Piel', prostate: 'Próstata', 'prostate gland': 'Próstata', penis: 'Pene', scrotum: 'Escroto', urethra: 'Uretra',
    'muscular system': 'Sistema muscular', 'nervous system': 'Sistema nervioso', 'digestive system': 'Sistema digestivo',
    'respiratory system': 'Sistema respiratorio', 'urinary system': 'Sistema urinario',
};
const PAIRED: Record<string, [
    string,
    'm' | 'f'
]> = {
    femur: ['Fémur', 'm'], tibia: ['Tibia', 'f'], fibula: ['Fíbula', 'f'], patella: ['Rótula', 'f'],
    humerus: ['Húmero', 'm'], radius: ['Radio', 'm'], ulna: ['Ulna', 'f'], scapula: ['Escápula', 'f'], clavicle: ['Clavícula', 'f'],
    'hip bone': ['Hueso coxal', 'm'], 'temporal bone': ['Hueso temporal', 'm'], 'parietal bone': ['Hueso parietal', 'm'],
    'zygomatic bone': ['Hueso cigomático', 'm'], maxilla: ['Maxilar', 'm'], calcaneus: ['Calcáneo', 'm'], talus: ['Astrágalo', 'm'],
    eyeball: ['Globo ocular', 'm'], 'optic nerve': ['Nervio óptico', 'm'], 'sciatic nerve': ['Nervio ciático', 'm'],
    'vagus nerve': ['Nervio vago', 'm'], 'median nerve': ['Nervio mediano', 'm'], 'ulnar nerve': ['Nervio ulnar', 'm'],
    'radial nerve': ['Nervio radial', 'm'], 'femoral nerve': ['Nervio femoral', 'm'], 'facial nerve': ['Nervio facial', 'm'],
    ureter: ['Uréter', 'm'], testis: ['Testículo', 'm'], 'adrenal gland': ['Glándula suprarrenal', 'f'],
    'renal artery': ['Arteria renal', 'f'], 'renal vein': ['Vena renal', 'f'], 'femoral artery': ['Arteria femoral', 'f'],
    'femoral vein': ['Vena femoral', 'f'], 'common carotid artery': ['Arteria carótida común', 'f'],
    'internal carotid artery': ['Arteria carótida interna', 'f'], 'external carotid artery': ['Arteria carótida externa', 'f'],
    'internal jugular vein': ['Vena yugular interna', 'f'], 'subclavian artery': ['Arteria subclavia', 'f'],
    'subclavian vein': ['Vena subclavia', 'f'], 'pulmonary artery': ['Arteria pulmonar', 'f'],
    'deltoid muscle': ['Músculo deltoides', 'm'], 'biceps brachii': ['Bíceps braquial', 'm'], 'triceps brachii': ['Tríceps braquial', 'm'],
    'pectoralis major': ['Pectoral mayor', 'm'], 'gluteus maximus': ['Glúteo mayor', 'm'], 'masseter muscle': ['Músculo masetero', 'm'],
};
export function displayName(name: string): string {
    const key = name.toLowerCase().trim();
    if (LABELS[key])
        return LABELS[key];
    const pair = /^(left|right) (.+)$/.exec(key);
    if (pair && PAIRED[pair[2]]) {
        const [label, gender] = PAIRED[pair[2]];
        return `${label} ${pair[1] === 'left' ? 'izquierd' : 'derech'}${gender === 'f' ? 'a' : 'o'}`;
    }
    if (PAIRED[key])
        return PAIRED[key][0];
    const rib = /^(left|right) (\d+)(?:st|nd|rd|th) rib$/.exec(key);
    if (rib)
        return `${rib[2]}.ª costilla ${rib[1] === 'left' ? 'izquierda' : 'derecha'}`;
    return name;
}
export const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export type SearchEntry = Concept & {
    label: string;
    searchText: string;
};
export function buildSearchIndex(atlas: Atlas): SearchEntry[] {
    const entries = atlas.concepts.map(concept => ({ ...concept, label: displayName(concept.name), searchText: normalize(`${concept.name} ${displayName(concept.name)} ${concept.id} ${concept.elements.join(' ')}`) }));
    // Some source meshes have no one-piece concept entry; allow direct FJ lookup.
    for (const part of atlas.parts)
        if (!entries.some(entry => entry.elements.length === 1 && entry.elements[0] === part.id)) {
            entries.push({ id: part.id, name: part.name, elements: [part.id], label: displayName(part.name), searchText: normalize(`${part.id} ${part.conceptId} ${part.name} ${displayName(part.name)}`) });
        }
    return entries;
}
export function searchCatalog(entries: SearchEntry[], query: string): SearchEntry[] {
    const term = normalize(query);
    if (!term)
        return ['heart', 'brain', 'liver', 'kidney', 'stomach', 'mitral valve', 'aortic valve', 'trachea'].flatMap(name => {
            const entry = entries.find(item => item.name.toLowerCase() === name);
            return entry ? [entry] : [];
        });
    const words = term.split(/\s+/);
    return entries.filter(entry => words.every(word => entry.searchText.includes(word))).sort((a, b) => {
        const score = (item: SearchEntry) => normalize(item.label) === term || normalize(item.name) === term || normalize(item.id) === term ? 0 : item.elements.includes(query.toUpperCase()) && item.elements.length === 1 ? 1 : 2;
        return score(a) - score(b) || a.label.length - b.label.length;
    });
}
