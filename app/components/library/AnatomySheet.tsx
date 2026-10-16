"use client";

import { useEffect, useRef } from "react";
import { Activity, ArrowRight, BookOpen, Droplets, Heart, MapPin, Network, Ruler, Scale, Stethoscope, Waves, X } from "lucide-react";
import { organPhrase, type Organ } from "../../lib/anatomy-data";
import { OrganArt } from "../shared/OrganArt";

export function AnatomySheet({ organ, favorite, onToggleFavorite, onViewOrgan, onClose }: { organ: Organ; favorite: boolean; onToggleFavorite: () => void; onViewOrgan: () => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="anatomy-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" onMouseDown={(event) => event.stopPropagation()}>
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Cerrar ficha anatómica"><X size={18} /></button>
        <header>
          <span className="sheet-art"><OrganArt organ={organ} asset="organ" alt={`Ilustración anatómica ${organPhrase(organ, "de")}`} /></span>
          <div><small>{organ.system}</small><h1 id="sheet-title">{organ.name}</h1><em>{organ.scientificName}</em><p>{organ.description}</p></div>
        </header>
        <div className="sheet-facts">
          <article><MapPin size={16} /><span>Ubicación</span><p>{organ.location}</p></article>
          <article><Ruler size={16} /><span>Tamaño</span><p>{organ.size}</p></article>
          <article><Scale size={16} /><span>Peso</span><p>{organ.weight}</p></article>
          <article><Activity size={16} /><span>Cada día</span><p>{organ.dailyFact}</p></article>
          <article><Droplets size={16} /><span>Irrigación</span><p>{organ.bloodSupply}</p></article>
          <article><Network size={16} /><span>Inervación</span><p>{organ.innervation}</p></article>
          <article><Waves size={16} /><span>Vascularización</span><p>{organ.venousDrainage}</p></article>
          <article><Heart size={16} /><span>Función</span><p>{organ.function}</p></article>
        </div>
        <section className="sheet-section"><h2>Estructuras anatómicas</h2><div className="structure-list">{organ.hotspots.map((hotspot) => <span key={hotspot.id}><b>{hotspot.label}</b>{hotspot.detail}</span>)}</div></section>
        <section className="sheet-columns"><div><h2><Stethoscope size={18} /> Importancia médica</h2><p>{organ.medical}</p><ul>{organ.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul></div><aside><span>¿Sabías que…?</span><p>{organ.funFact}</p></aside></section>
        <p className="sheet-references"><BookOpen size={15} /><span><b>Sustento</b>{organ.references}</span></p>
        <footer>
          <button type="button" className={`secondary-action ${favorite ? "active" : ""}`} onClick={onToggleFavorite}><Heart size={15} fill={favorite ? "currentColor" : "none"} /> {favorite ? "En favoritos" : "Guardar"}</button>
          <button type="button" className="primary-action" onClick={onViewOrgan}>Ver en 3D <ArrowRight size={15} /></button>
        </footer>
      </section>
    </div>
  );
}
