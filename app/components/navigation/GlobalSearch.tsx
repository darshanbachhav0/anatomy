"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BookOpen, BrainCircuit, FileText, Search } from "lucide-react";
import { organs, type OrganId } from "../../lib/anatomy-data";
import { anatomySystems } from "../../lib/system-data";
import { matchesSearch, normalizeSearch } from "../../lib/search";

export function GlobalSearch({ onViewOrgan, onViewSystem, onViewLesson, onOpenSheet }: { onViewOrgan: (organId: OrganId) => void; onViewSystem: (systemId: string) => void; onViewLesson: (organId: OrganId) => void; onOpenSheet: (organId: OrganId) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const normalized = normalizeSearch(query);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (event.key === "Escape") setOpen(false);
    };
    const handlePointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerdown", handlePointer);
    return () => { window.removeEventListener("keydown", handleKey); window.removeEventListener("pointerdown", handlePointer); };
  }, []);

  const results = useMemo(() => ({
    organs: organs.filter((organ) => matchesSearch(normalized, organ.name, organ.system, organ.function)).slice(0, 4),
    systems: anatomySystems.filter((system) => matchesSearch(normalized, system.name, system.description)).slice(0, 3),
    lessons: organs.filter((organ) => matchesSearch(normalized, "anatomía lección función", organ.name, organ.system)).slice(0, 3),
    library: organs.filter((organ) => matchesSearch(normalized, "ficha irrigación clínica", organ.name, organ.bloodSupply, organ.medical)).slice(0, 3),
  }), [normalized]);
  const hasResults = Object.values(results).some((items) => items.length > 0);
  const select = (action: () => void) => { action(); setOpen(false); setQuery(""); };

  return (
    <div className={`global-search ${open ? "open" : ""}`} ref={rootRef}>
      <button type="button" className="global-search-mobile" onClick={() => { setOpen(true); window.requestAnimationFrame(() => inputRef.current?.focus()); }} aria-label="Abrir búsqueda global"><Search size={18} /></button>
      <label className="search-box"><Search size={17} /><input ref={inputRef} value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} placeholder="Buscar órgano, sistema o tema..." aria-label="Búsqueda global" /><kbd>Ctrl K</kbd></label>
      {open && normalized && <div className="search-results" role="listbox" aria-label="Resultados de búsqueda">
        {!hasResults && <p>No se encontraron resultados.</p>}
        {results.organs.length > 0 && <SearchGroup title="Órganos" icon={<Search size={13} />}>{results.organs.map((organ) => <button type="button" key={organ.id} onClick={() => select(() => onViewOrgan(organ.id))}><b>{organ.name}</b><span>{organ.system}</span></button>)}</SearchGroup>}
        {results.systems.length > 0 && <SearchGroup title="Sistemas" icon={<BrainCircuit size={13} />}>{results.systems.map((system) => <button type="button" key={system.id} onClick={() => select(() => onViewSystem(system.id))}><b>{system.name}</b><span>{system.primaryFunction}</span></button>)}</SearchGroup>}
        {results.lessons.length > 0 && <SearchGroup title="Lecciones" icon={<BookOpen size={13} />}>{results.lessons.map((organ) => <button type="button" key={organ.id} onClick={() => select(() => onViewLesson(organ.id))}><b>Anatomía de {organ.name.toLowerCase()}</b><span>Ruta de 7 módulos</span></button>)}</SearchGroup>}
        {results.library.length > 0 && <SearchGroup title="Biblioteca" icon={<FileText size={13} />}>{results.library.map((organ) => <button type="button" key={organ.id} onClick={() => select(() => onOpenSheet(organ.id))}><b>Ficha de {organ.name.toLowerCase()}</b><span>Irrigación, estructuras y clínica</span></button>)}</SearchGroup>}
      </div>}
    </div>
  );
}

function SearchGroup({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <section><h2>{icon}{title}</h2><div>{children}</div></section>;
}
