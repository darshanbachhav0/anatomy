// Adapted from Human Atlas (MIT); visible actions are also available without WebMCP.
import type { Atlas, Concept } from './anatomy';
import { buildSearchIndex, searchCatalog } from './catalog';
type Tool = {
    name: string;
    description: string;
    inputSchema: object;
    annotations: {
        readOnlyHint: boolean;
    };
    execute: (input: unknown) => unknown;
};
function record(input: unknown): Record<string, unknown> {
    if (!input || typeof input !== 'object' || Array.isArray(input))
        throw new Error('Se esperaba un objeto.');
    return input as Record<string, unknown>;
}
export function atlasTools(atlas: Atlas, inspect: (concept: Concept) => void): Tool[] {
    const index = buildSearchIndex(atlas);
    return [
        {
            name: 'find_anatomy', description: 'Busca estructuras del atlas UMA por nombre en español, nombre original o identificador FMA/FJ.',
            inputSchema: { type: 'object', properties: { query: { type: 'string', minLength: 1 } }, required: ['query'], additionalProperties: false },
            annotations: { readOnlyHint: true },
            execute(input) {
                const data = record(input);
                if (typeof data.query !== 'string' || !data.query.trim())
                    throw new Error('Escribe una búsqueda no vacía.');
                return searchCatalog(index, data.query).slice(0, 30).map(item => ({ id: item.id, name: item.label, originalName: item.name, pieces: item.elements.length }));
            },
        },
        {
            name: 'inspect_anatomical_structure', description: 'Selecciona y aísla una estructura del atlas UMA y abre su panel de información.',
            inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
            annotations: { readOnlyHint: false },
            execute(input) {
                const data = record(input);
                if (typeof data.id !== 'string')
                    throw new Error('Se requiere un identificador del atlas.');
                const id = data.id.toUpperCase();
                const concept = index.find(item => item.id === id) ?? index.find(item => item.elements.length === 1 && item.elements[0] === id);
                if (!concept)
                    throw new Error('La estructura no está presente en este atlas.');
                inspect(concept);
                return { id: concept.id, name: concept.label, selectedPieces: concept.elements.length };
            },
        },
    ];
}
export function registerAtlasTools(atlas: Atlas, inspect: (concept: Concept) => void) {
    const context = (document as Document & {
        modelContext?: {
            registerTool: (tool: Tool, options: {
                signal: AbortSignal;
            }) => void | Promise<void>;
        };
    }).modelContext;
    if (!context?.registerTool)
        return;
    const lifecycle = new AbortController();
    for (const tool of atlasTools(atlas, inspect)) {
        try {
            void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => { });
        }
        catch { /* This optional capability must never prevent using the visible UI. */ }
    }
    return () => lifecycle.abort();
}
