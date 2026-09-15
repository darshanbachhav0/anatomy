"use client";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Box, Check, ChevronDown, Eye, EyeOff, Focus, HeartPulse, Layers3, LoaderCircle, Minus, Pause, Play, Plus, Redo2, RotateCcw, Search, Undo2, X } from 'lucide-react';
import { EXPLANATIONS, SYSTEMS, explanation, type Atlas, type Concept, type SceneState, type SystemId, type View } from './anatomy';
import { buildSearchIndex, changeHidden, displayName, EMPTY_HISTORY, HEART_CAVITIES, HEART_WALLS, INITIAL_STATE, ORGAN_SYSTEMS, redoHidden, searchCatalog, undoHidden, visibleParts } from './catalog';
import { registerAtlasTools } from './agent-tools';
import type { OrganId } from '../../lib/anatomy-data';
import './atlas.css';
const AnatomyScene = lazy(() => import('./scene'));
type Props = {
    initialScope?: 'body' | 'heart';
    onBack: () => void;
    onViewOrgan: (id: OrganId) => void;
};
const ORGAN_LINKS: Record<string, OrganId> = { heart: 'heart', brain: 'brain', liver: 'liver', kidney: 'kidneys', 'left kidney': 'kidneys', 'right kidney': 'kidneys', lungs: 'lungs', lung: 'lungs', pancreas: 'pancreas', eyeball: 'eyeball', skin: 'skin', intestine: 'intestine', 'small intestine': 'intestine', 'large intestine': 'intestine' };
const number = (value: number) => value.toLocaleString('es-PE');
export default function FullBodyAtlas(props: Props) {
    const [atlas, setAtlas] = useState<Atlas | null>(null);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        const abort = new AbortController();
        fetch('/atlas/models/atlas.json', { signal: abort.signal })
            .then(async (response) => {
            if (!response.ok)
                throw new Error('No se pudo cargar el catálogo anatómico.');
            const data: Atlas = await response.json();
            if (!data.parts?.length || !data.concepts?.length || !data.chunks?.length)
                throw new Error('El catálogo anatómico no es válido.');
            if (!abort.signal.aborted)
                setAtlas(data);
        })
            .catch(reason => { if (!abort.signal.aborted)
            setError(reason instanceof Error ? reason.message : 'Error al cargar el atlas.'); });
        return () => abort.abort();
    }, [attempt]);
    if (!atlas)
        return <section className="atlas-loading" aria-live="polite">
    {error ? <><h1>No se pudo abrir el atlas</h1><p>{error}</p><button type="button" onClick={() => { setError(''); setAttempt(value => value + 1); }}>Reintentar</button></> : <><LoaderCircle className="atlas-spinner" size={30}/><h1>Preparando el cuerpo completo</h1><p>Cargando el catálogo de estructuras anatómicas…</p></>}
    <button type="button" onClick={props.onBack}>Volver a órganos</button>
  </section>;
    return <AtlasWorkspace {...props} atlas={atlas}/>;
}
function AtlasWorkspace({ atlas, initialScope = 'body', onBack, onViewOrgan }: Props & {
    atlas: Atlas;
}) {
    const heart = useMemo(() => atlas.concepts.find(concept => concept.id === 'FMA7088')!, [atlas]);
    const [state, setState] = useState<SceneState>(() => ({ ...INITIAL_STATE, scope: initialScope === 'heart' ? heart.elements : null }));
    const [history, setHistory] = useState(EMPTY_HISTORY);
    const [selected, setSelected] = useState<Concept | null>(null);
    const [query, setQuery] = useState('');
    const [resultLimit, setResultLimit] = useState(30);
    const [memberLimit, setMemberLimit] = useState(30);
    const [panelsOpen, setPanelsOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);
    const searchInput = useRef<HTMLInputElement>(null);
    const index = useMemo(() => buildSearchIndex(atlas), [atlas]);
    const partsById = useMemo(() => new Map(atlas.parts.map(part => [part.id, part])), [atlas]);
    const results = useMemo(() => searchCatalog(index, query), [index, query]);
    const effective = useMemo(() => ({ ...state, hidden: history.present }), [state, history.present]);
    const visible = useMemo(() => visibleParts(atlas, effective), [atlas, effective]);
    const visibleIds = useMemo(() => new Set(visible.map(part => part.id)), [visible]);
    const systemsCount = useMemo(() => new Map(SYSTEMS.map(system => [system.id, atlas.parts.filter(part => part.system === system.id).length])), [atlas]);
    const heartMode = state.scope === heart.elements;
    const ready = progress === 100 && !error;
    const selectedParts = selected?.elements.flatMap(id => partsById.get(id) ?? []) ?? [];
    const selectedVisible = selectedParts.filter(part => visibleIds.has(part.id));
    const system = SYSTEMS.find(item => item.id === selectedParts[0]?.system);
    const linkedOrgan = selected ? ORGAN_LINKS[selected.name.toLowerCase()] : undefined;
    const onProgress = useCallback((value: number) => setProgress(value), []);
    const onError = useCallback((message: string) => setError(message), []);
    const choose = useCallback((concept: Concept, isolate?: boolean) => {
        setSelected(concept);
        setMemberLimit(30);
        setHistory(previous => changeHidden(previous, previous.present.filter(id => !concept.elements.includes(id))));
        setState(previous => ({ ...previous, selected: concept.elements,
            // A global search can leave a study area; picking within it preserves it.
            scope: previous.scope && concept.elements.every(id => previous.scope!.includes(id)) ? previous.scope : null,
            isolate: isolate ?? previous.isolate, rotate: false,
        }));
    }, []);
    const selectPart = useCallback((id: string) => {
        const part = partsById.get(id);
        if (part)
            choose({ id: part.id, name: part.name, elements: [id] });
    }, [partsById, choose]);
    useEffect(() => registerAtlasTools(atlas, concept => choose(concept, true)), [atlas, choose]);
    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || target?.closest('input, textarea, select, [contenteditable="true"]'))
                return;
            event.preventDefault();
            setPanelsOpen(true);
            requestAnimationFrame(() => searchInput.current?.focus());
        };
        window.addEventListener('keydown', keyboard);
        return () => window.removeEventListener('keydown', keyboard);
    }, []);
    function reset(scope: string[] | null = state.scope) {
        setState(previous => ({ ...INITIAL_STATE, scope, reset: previous.reset + 1, focus: previous.focus, zoom: previous.zoom }));
        setHistory(EMPTY_HISTORY);
        setSelected(null);
        setQuery('');
        setResultLimit(30);
    }
    function preset(systems: SystemId[]) {
        setState(previous => ({ ...previous, visible: systems, scope: null, selected: [], isolate: false, reset: previous.reset + 1 }));
        setHistory(EMPTY_HISTORY);
        setSelected(null);
    }
    function toggleSystem(id: SystemId) {
        setState(previous => ({ ...previous, selected: [], isolate: false, visible: previous.visible.includes(id) ? previous.visible.filter(item => item !== id) : [...previous.visible, id] }));
        setSelected(null);
    }
    const hide = (ids: string[]) => setHistory(previous => changeHidden(previous, [...previous.present, ...ids]));
    const restore = (id: string) => setHistory(previous => changeHidden(previous, previous.present.filter(item => item !== id)));
    return <section className="atlas-workspace" aria-labelledby="atlas-title">
    <header className="atlas-heading">
      <div><span className="atlas-kicker"><Layers3 size={15}/> UMA · Laboratorio anatómico</span><h1 id="atlas-title">{heartMode ? 'Corazón por piezas' : 'Cuerpo completo'}</h1><p>{number(atlas.parts.length)} piezas reales · 15 capas anatómicas · Referencia adulta masculina</p></div>
      <div className="atlas-heading-actions"><button type="button" onClick={() => reset(heartMode ? null : heart.elements)}><HeartPulse size={17}/>{heartMode ? 'Cuerpo completo' : 'Estudiar el corazón'}</button><button type="button" onClick={onBack}><ArrowLeft size={17}/> Órganos</button></div>
    </header>
    <button type="button" className="atlas-panel-toggle" onClick={() => setPanelsOpen(value => !value)} aria-expanded={panelsOpen} aria-controls="atlas-catalog"><Search size={17}/> Buscar y elegir capas <ChevronDown size={16}/></button>
    <div className={`atlas-layout${selected ? ' has-selection' : ''}`}>
      <aside id="atlas-catalog" className={`atlas-catalog${panelsOpen ? ' is-open' : ''}`} aria-label="Catálogo y capas del atlas">
        <div className="atlas-search"><label htmlFor="atlas-search">Buscar una estructura <kbd>/</kbd></label><div><Search size={17}/><input ref={searchInput} id="atlas-search" type="search" placeholder="Corazón, fémur, FMA…" value={query} onChange={event => { setQuery(event.target.value); setResultLimit(30); }}/></div></div>
        <div className="atlas-results" aria-label="Resultados anatómicos">
          <span className="atlas-subtitle">{query.trim() ? `${number(results.length)} resultados` : 'Exploraciones sugeridas'}</span>
          {results.length === 0 && <p>No hay coincidencias. Prueba el nombre original en inglés o el identificador FMA/FJ.</p>}
          {results.slice(0, resultLimit).map(result => <button type="button" key={result.id} className={selected?.id === result.id ? 'is-selected' : ''} onClick={() => { choose(result, true); setPanelsOpen(false); }}><span>{result.label}<small>{result.id} · {number(result.elements.length)} {result.elements.length === 1 ? 'pieza' : 'piezas'}</small></span><Focus size={15}/></button>)}
          {results.length > resultLimit && <button type="button" className="atlas-more" onClick={() => setResultLimit(value => value + 30)}>Mostrar 30 más</button>}
        </div>
        <div className="atlas-layer-heading"><h2>Capas anatómicas</h2><span>{state.visible.length}/{SYSTEMS.length}</span></div>
        <div className="atlas-presets"><button type="button" onClick={() => preset(SYSTEMS.map(item => item.id))}>Todas</button><button type="button" onClick={() => preset(['skeletal'])}>Esqueleto</button><button type="button" onClick={() => preset([...ORGAN_SYSTEMS])}>Órganos</button></div>
        <div className="atlas-layers">{SYSTEMS.map(item => <div className="atlas-layer-row" key={item.id} style={{ '--layer-color': item.color } as React.CSSProperties}>
          <button type="button" className="atlas-system-name" title={`Mostrar solo ${item.name.toLowerCase()}`} aria-label={`Mostrar solo ${item.name.toLowerCase()}`} aria-pressed={state.visible.length === 1 && state.visible[0] === item.id} onClick={() => { setState(previous => ({ ...previous, visible: [item.id], selected: [], isolate: false })); setSelected(null); }}><i /><span>{item.name}</span><small>{systemsCount.get(item.id)}</small></button>
          <button type="button" className="atlas-system-toggle" aria-label={`Visibilidad: ${item.name}`} onClick={() => toggleSystem(item.id)} aria-pressed={state.visible.includes(item.id)}>{state.visible.includes(item.id) ? <Eye size={16}/> : <EyeOff size={16}/>}</button>
        </div>)}</div>
        <button type="button" className="atlas-more" onClick={() => { setState(previous => ({ ...previous, visible: [], selected: [], isolate: false })); setSelected(null); }}>Ocultar todas las capas</button>
        <p className="atlas-hint">Pulsa un nombre para mostrar solo ese sistema, o el ojo para combinar capas. La superficie corporal está oculta inicialmente. Puedes buscar nombres en español, inglés o identificadores FMA/FJ.</p>
      </aside>

      <div className="atlas-stage-column">
        <div className="atlas-view-tools" aria-label="Controles de cámara">
          <div className="atlas-camera-views">{([['front', 'Frente'], ['side', 'Perfil'], ['back', 'Posterior'], ['three-quarter', '¾']] as [
        View,
        string
    ][]).map(([view, label]) => <button type="button" key={view} aria-pressed={(state.explode >= .8 ? 'front' : state.view) === view} disabled={!ready || (state.explode >= .8 && view !== 'front')} onClick={() => setState(previous => ({ ...previous, view, reset: previous.reset + 1, rotate: false }))}>{label}</button>)}</div>
          <div className="atlas-icon-tools"><button type="button" aria-label="Alejar" disabled={!ready} onClick={() => setState(previous => ({ ...previous, zoom: previous.zoom - 1 }))}><Minus size={17}/></button><button type="button" aria-label="Acercar" disabled={!ready} onClick={() => setState(previous => ({ ...previous, zoom: previous.zoom + 1 }))}><Plus size={17}/></button><button type="button" aria-label={state.rotate ? 'Pausar giro' : 'Giro automático'} aria-pressed={state.rotate} disabled={!ready || state.explode >= .4} onClick={() => setState(previous => ({ ...previous, rotate: !previous.rotate }))}>{state.rotate ? <Pause size={17}/> : <Play size={17}/>}</button><button type="button" aria-label="Restablecer vista y piezas" onClick={() => reset()}><RotateCcw size={17}/></button></div>
        </div>
        {heartMode && <div className="atlas-heart-tools"><span><HeartPulse size={16}/> Disección por estructuras</span><button type="button" onClick={() => { hide([...HEART_WALLS, ...HEART_CAVITIES]); setState(previous => ({ ...previous, isolate: false })); }}>Ver interior</button><button type="button" onClick={() => reset(heart.elements)}>Rearmar corazón</button><small>Oculta paredes y volúmenes de cavidad; no genera cortes artificiales.</small></div>}
        {state.isolate && <div className="atlas-context"><Focus size={15}/><span>Aislamiento activo</span><button type="button" onClick={() => setState(previous => ({ ...previous, isolate: false }))}>Mostrar contexto</button></div>}
        <div className="atlas-canvas-wrap" aria-busy={!ready && !error}>
          {!error && <Suspense fallback={null}><AnatomyScene key={attempt} atlas={atlas} state={effective} onSelect={selectPart} onProgress={onProgress} onError={onError}/></Suspense>}
          {!ready && <div className="atlas-scene-status" role={error ? 'alert' : 'status'}>{error ? <><h2>No se pudo completar la carga</h2><p>{error}</p><button type="button" onClick={() => { setError(''); setProgress(0); setAttempt(value => value + 1); }}>Reintentar visor</button></> : <><LoaderCircle className="atlas-spinner" size={28}/><strong>Cargando anatomía · {progress}%</strong><progress value={progress} max={100} aria-label="Carga del modelo"/><p>La primera carga descarga unos 33 MB. Las piezas aparecerán progresivamente.</p></>}</div>}
          {ready && visible.length === 0 && <div className="atlas-scene-status"><EyeOff size={26}/><h2>No hay piezas visibles</h2><p>Activa una capa, restaura piezas o sal del aislamiento.</p><button type="button" onClick={() => reset()}>Restaurar área de estudio</button></div>}
          <div className="atlas-stage-caption"><span>{number(visible.length)} piezas visibles</span><span>Arrastra para {state.explode >= .8 ? 'desplazar' : 'girar'} · Rueda o pellizco para acercar</span></div>
        </div>
        <div className="atlas-explosion"><div><label htmlFor="atlas-explode"><Box size={17}/> Despiece anatómico</label><output htmlFor="atlas-explode">{Math.round(state.explode * 100)}%</output></div><input id="atlas-explode" type="range" min="0" max="100" step="1" value={Math.round(state.explode * 100)} disabled={!ready} onChange={event => { const value = Number(event.target.value) / 100; setState(previous => ({ ...previous, explode: value, rotate: false })); }}/><div className="atlas-range-labels"><span>Ensamblado</span><span>Separación por sistemas</span><span>Piezas individuales</span></div></div>
        <div className="atlas-history"><span><EyeOff size={16}/> {history.present.length} ocultas</span><button type="button" disabled={!history.past.length} onClick={() => setHistory(undoHidden)}><Undo2 size={16}/> Deshacer</button><button type="button" disabled={!history.future.length} onClick={() => setHistory(redoHidden)}><Redo2 size={16}/> Rehacer</button><button type="button" disabled={!history.present.length} onClick={() => setHistory(previous => changeHidden(previous, []))}>Restaurar todas</button></div>
        {history.present.length > 0 && <details className="atlas-hidden-list"><summary>Piezas ocultas ({history.present.length})</summary><div>{history.present.map(id => <button type="button" key={id} onClick={() => restore(id)}><Eye size={15}/>{displayName(partsById.get(id)?.name ?? id)}<span>Restaurar</span></button>)}</div></details>}
      </div>

      {selected && <aside className="atlas-inspector" aria-labelledby="atlas-selection-title">
        <div className="atlas-inspector-top"><span className="atlas-kicker">Estructura seleccionada</span><button type="button" aria-label="Cerrar selección" onClick={() => { setSelected(null); setState(previous => ({ ...previous, selected: [], isolate: false })); }}><X size={18}/></button></div>
        <h2 id="atlas-selection-title">{displayName(selected.name)}</h2><p className="atlas-source-name">Nombre original del catálogo: <span lang="en">{selected.name}</span></p>
        <div className="atlas-selection-meta"><code>{selected.id}</code><span>{selected.elements.length} {selected.elements.length === 1 ? 'pieza' : 'piezas'}</span></div>
        {system && <><h3>{EXPLANATIONS[selected.name.toLowerCase()] ? 'Descripción' : `Contexto: ${system.name}`}</h3><p>{explanation(selected.name, system.id)}</p></>}
        {selectedParts.some(part => HEART_CAVITIES.includes(part.id)) && <p className="atlas-notice">Las cavidades se representan como volúmenes sólidos de referencia; no son tejido. Ocúltalas para observar las estructuras internas.</p>}
        <div className="atlas-selection-actions"><button type="button" className="atlas-primary" disabled={!selectedVisible.length} onClick={() => setState(previous => ({ ...previous, isolate: !previous.isolate, rotate: false }))}><Focus size={16}/>{state.isolate ? 'Mostrar contexto' : 'Aislar selección'}</button><button type="button" disabled={!ready || !selectedVisible.length} onClick={() => setState(previous => ({ ...previous, focus: previous.focus + 1, rotate: false }))}>Centrar cámara</button><button type="button" disabled={!selectedVisible.length} onClick={() => hide(selected.elements)}><EyeOff size={16}/> Ocultar selección</button>{linkedOrgan && <button type="button" onClick={() => onViewOrgan(linkedOrgan)}>Abrir ficha y visor del órgano <ArrowLeft className="atlas-forward" size={16}/></button>}</div>
        <h3>Piezas de esta estructura</h3><div className="atlas-members">{selectedParts.slice(0, memberLimit).map(part => <div key={part.id}><button type="button" onClick={() => choose({ id: part.id, name: part.name, elements: [part.id] })}><span>{displayName(part.name)}</span><small>{part.id}</small></button><button type="button" aria-label={`${history.present.includes(part.id) ? 'Restaurar' : 'Ocultar'} ${displayName(part.name)}`} onClick={() => history.present.includes(part.id) ? restore(part.id) : hide([part.id])}>{history.present.includes(part.id) ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>)}</div>
        {selectedParts.length > memberLimit && <button type="button" className="atlas-more" onClick={() => setMemberLimit(value => value + 30)}>Mostrar 30 piezas más</button>}
        <p className="atlas-hint"><Check size={14}/> Cada pieza corresponde a geometría real del catálogo. Los nombres especializados aún no traducidos se conservan en inglés.</p>
      </aside>}
    </div>
    <details className="atlas-credits"><summary>Fuentes, licencias y alcance educativo</summary><p>Geometría: BodyParts3D, © The Database Center for Life Science, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Visor adaptado de <a href="https://github.com/ashemag/human-atlas" target="_blank" rel="noreferrer">Human Atlas</a> (<a href="/atlas/LICENSE.txt" target="_blank" rel="noreferrer">MIT</a>), con interfaz UMA, traducciones, ajustes de catálogo y controles de ocultamiento.</p><p>Referencia anatómica adulta masculina, simplificada para la web. No incluye todas las variaciones anatómicas ni sustituye la enseñanza clínica. <a href="/atlas/ATTRIBUTION.md" target="_blank" rel="noreferrer">Créditos y modificaciones completos</a>.</p></details>
  </section>;
}
