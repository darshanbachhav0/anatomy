"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BookOpen, ExternalLink, FileText, X } from "lucide-react";
import { organPhrase, type Organ } from "../../lib/anatomy-data";
import { organResources, resourceMeta, type OrganResource } from "../../lib/organ-resources";

export function OrganResourcesPanel({ organ, onClose }: { organ: Organ; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { books, papers } = organResources[organ.id];

  useEffect(() => {
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="resources-modal" role="dialog" aria-modal="true" aria-labelledby="resources-title" onMouseDown={(event) => event.stopPropagation()}>
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Cerrar bibliografía"><X size={18} /></button>
        <header>
          <small>Bibliografía</small>
          <h1 id="resources-title">{organ.name}</h1>
          <p>Libros y artículos de investigación para profundizar en la anatomía {organPhrase(organ, "de")}. Los enlaces se abren en una pestaña nueva.</p>
        </header>
        <ResourceList title="Libros" icon={<BookOpen size={18} />} items={books} />
        <ResourceList title="Artículos de investigación" icon={<FileText size={18} />} items={papers} />
        <p className="resources-note"><b>Referencia del curso</b>{organ.references}</p>
      </section>
    </div>
  );
}

function ResourceList({ title, icon, items }: { title: string; icon: ReactNode; items: OrganResource[] }) {
  return (
    <section className="resources-section">
      <h2>{icon}{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.url}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <span><b>{item.title}</b><small>{resourceMeta(item)}</small></span>
              <em>{item.language === "es" ? "Español" : "Inglés"}{item.free ? " · Acceso libre" : ""}</em>
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
