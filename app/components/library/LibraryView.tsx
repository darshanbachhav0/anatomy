"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookMarked, FileText, Heart, LibraryBig, Search } from "lucide-react";
import { organs, type OrganId } from "../../lib/anatomy-data";
import { glossaryEntries } from "../../lib/glossary-data";
import { anatomySystems } from "../../lib/system-data";
import { matchesSearch, normalizeSearch } from "../../lib/search";
import { OrganArt } from "../shared/OrganArt";

type LibraryTab = "all" | "organs" | "systems" | "sheets" | "glossary" | "favorites";

const TABS: Array<{ id: LibraryTab; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "organs", label: "Órganos" },
  { id: "systems", label: "Sistemas" },
  { id: "sheets", label: "Fichas anatómicas" },
  { id: "glossary", label: "Glosario" },
  { id: "favorites", label: "Favoritos" },
];

export function LibraryView({
  favorites,
  onToggleFavorite,
  onViewOrgan,
  onOpenSheet,
  onViewSystem,
}: {
  favorites: OrganId[];
  onToggleFavorite: (organId: OrganId) => void;
  onViewOrgan: (organId: OrganId) => void;
  onOpenSheet: (organId: OrganId) => void;
  onViewSystem: (systemId: string) => void;
}) {
  const [tab, setTab] = useState<LibraryTab>("all");
  const [query, setQuery] = useState("");
  const normalized = normalizeSearch(query);
  const matchingOrgans = useMemo(() => organs.filter((organ) => {
    const matches = matchesSearch(normalized, organ.name, organ.system, organ.function, organ.location, organ.medical, organ.conditions.join(" "), organ.hotspots.map((spot) => spot.label).join(" "));
    return matches && (tab !== "favorites" || favorites.includes(organ.id));
  }), [normalized, tab, favorites]);
  const matchingGlossary = glossaryEntries.filter((entry) => matchesSearch(normalized, entry.term, entry.definition));
  const matchingSystems = anatomySystems.filter((system) => matchesSearch(normalized, system.name, system.description, system.primaryFunction));
  const showOrgans = ["all", "organs", "sheets", "favorites"].includes(tab);

  return (
    <section className="content-view" aria-labelledby="library-title">
      <header className="content-hero content-hero-row">
        <div><span className="content-kicker"><LibraryBig size={15} /> Centro de recursos</span><h1 id="library-title">Biblioteca anatómica</h1><p>Consulta fichas, sistemas y términos esenciales desde una sola colección.</p></div>
        <label className="library-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en la biblioteca..." aria-label="Buscar en la biblioteca" /></label>
      </header>
      <nav className="content-tabs" aria-label="Secciones de la biblioteca">
        {TABS.map((item) => <button type="button" key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>{item.label}</button>)}
      </nav>

      {showOrgans && (matchingOrgans.length > 0 ? <div className="resource-grid">
        {matchingOrgans.map((organ) => (
          <article className="resource-card anatomy-card" key={organ.id}>
            <span className="resource-art"><OrganArt organ={organ} asset="thumb" alt={`Ilustración de ${organ.name}`} /></span>
            <div><small>{organ.system}</small><h2>{organ.name}</h2><dl><div><dt>Función</dt><dd>{organ.function}</dd></div><div><dt>Ubicación</dt><dd>{organ.location}</dd></div></dl></div>
            <div className="card-actions">
              <button type="button" onClick={() => onOpenSheet(organ.id)}><FileText size={14} /> Ver ficha</button>
              <button type="button" onClick={() => onViewOrgan(organ.id)}>Ver en 3D <ArrowRight size={14} /></button>
              <button type="button" className={favorites.includes(organ.id) ? "active" : ""} onClick={() => onToggleFavorite(organ.id)} aria-label={favorites.includes(organ.id) ? `Quitar ${organ.name} de favoritos` : `Guardar ${organ.name}`}><Heart size={14} fill={favorites.includes(organ.id) ? "currentColor" : "none"} /></button>
            </div>
          </article>
        ))}
      </div> : <EmptyLibrary tab={tab} onExplore={() => setTab("organs")} />)}

      {tab === "systems" && <div className="library-system-list">{matchingSystems.map((system) => {
        const available = organs.filter((organ) => organ.system === system.name);
        return <article key={system.id}><span>{system.icon}</span><div><small>{available.length} modelos</small><h2>{system.name}</h2><p>{system.description}</p></div><button type="button" onClick={() => onViewSystem(system.id)}>Explorar <ArrowRight size={14} /></button></article>;
      })}</div>}

      {tab === "glossary" && <div className="glossary-view"><div className="alphabet-nav">{"ABCDEFGHIJLMNOPQRSTUV".split("").map((letter) => <button type="button" key={letter} onClick={() => setQuery(letter)}>{letter}</button>)}</div><dl>{matchingGlossary.map((entry) => <div key={entry.term}><dt>{entry.term}</dt><dd>{entry.definition}</dd></div>)}</dl>{matchingGlossary.length === 0 && <p className="empty-copy">No se encontraron términos con esa búsqueda.</p>}</div>}
    </section>
  );
}

function EmptyLibrary({ tab, onExplore }: { tab: LibraryTab; onExplore: () => void }) {
  return <div className="empty-state"><span>{tab === "favorites" ? <Heart size={24} /> : <BookMarked size={24} />}</span><h2>{tab === "favorites" ? "Aún no tienes órganos favoritos." : "No encontramos recursos."}</h2><p>Explora los modelos y guarda los contenidos que quieras revisar después.</p><button type="button" className="primary-action" onClick={onExplore}>Explorar órganos</button></div>;
}
