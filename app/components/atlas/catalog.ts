import type { Atlas, Concept, Part, SceneState, SystemId } from './anatomy';
import spanishNames from './names-es.json';
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
// Complete local catalog: source identifiers and names remain unchanged.
const SPANISH_NAMES: Record<string, string> = spanishNames;
export function hasSpanishName(name: string): boolean {
    return Object.hasOwn(SPANISH_NAMES, name.toLowerCase().trim());
}
export function displayName(name: string): string {
    const key = name.toLowerCase().trim();
    if (hasSpanishName(key)) return SPANISH_NAMES[key];
    const rib = /^(left|right) (\d+)(?:st|nd|rd|th) rib$/.exec(key);
    if (rib) return `${rib[2]}.ª costilla ${rib[1] === 'left' ? 'izquierda' : 'derecha'}`;
    // Unknown future entries must not silently introduce English labels.
    return 'Estructura sin traducción disponible';
}
function searchAliases(name: string, label: string): string {
    const key = name.toLowerCase();
    const aliases: string[] = [];
    if (key === 'brain') aliases.push('cerebro');
    if (key === 'kidney') aliases.push('riñones');
    if (key === 'lung') aliases.push('pulmones');
    if (key.includes('fibula')) aliases.push('fíbula fibular');
    if (key.includes('ulna')) aliases.push('ulna ulnar');
    if (key.includes('scapula')) aliases.push('omóplato');
    if (key.includes('gastrocnemius')) aliases.push('gemelos');
    if (key.includes('oculomotor nerve')) aliases.push('nervio motor ocular común tercer par craneal');
    if (key.includes('gyrus')) aliases.push(label.replace(/giro/gi, 'circunvolución'));
    return aliases.join(' ');
}
export const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\b(izquierd|derech)[oa]s?\b/g, '$1').trim();
export type SearchEntry = Concept & {
    label: string;
    searchText: string;
};
export function buildSearchIndex(atlas: Atlas): SearchEntry[] {
    const entries = atlas.concepts.map(concept => ({ ...concept, label: displayName(concept.name), searchText: normalize(`${concept.name} ${displayName(concept.name)} ${searchAliases(concept.name, displayName(concept.name))} ${concept.id} ${concept.elements.join(' ')}`) }));
    // Some source meshes have no one-piece concept entry; allow direct FJ lookup.
    for (const part of atlas.parts)
        if (!entries.some(entry => entry.elements.length === 1 && entry.elements[0] === part.id)) {
            entries.push({ id: part.id, name: part.name, elements: [part.id], label: displayName(part.name), searchText: normalize(`${part.id} ${part.conceptId} ${part.name} ${displayName(part.name)} ${searchAliases(part.name, displayName(part.name))}`) });
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
