"use client";

import { Eye, Focus, Info, RotateCcw, Scissors } from "lucide-react";
import { useState } from "react";
import type { DissectionStructure } from "../../lib/dissection-data";

export function StructureInfo({
  structure,
  available,
  removed,
  isolated,
  onRemove,
  onRestore,
  onIsolate,
  onFocus,
}: {
  structure: DissectionStructure;
  available: boolean;
  removed: boolean;
  isolated: boolean;
  onRemove: () => void;
  onRestore: () => void;
  onIsolate: () => void;
  onFocus: () => void;
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="dissection-structure-info" aria-labelledby="selected-structure-title">
      <span>Estructura seleccionada</span>
      <h3 id="selected-structure-title">{structure.label}</h3>
      <p>{structure.description}</p>
      <div className="dissection-structure-actions">
        {structure.removable && !removed && available && <button type="button" onClick={onRemove}><Scissors size={13} /> Retirar</button>}
        {removed && <button type="button" onClick={onRestore}><RotateCcw size={13} /> Restaurar</button>}
        {!removed && available && <button type="button" className={isolated ? "active" : ""} onClick={onIsolate}><Eye size={13} /> {isolated ? "Mostrar conjunto" : "Aislar"}</button>}
        {!removed && available && <button type="button" onClick={onFocus}><Focus size={13} /> Centrar</button>}
        <button type="button" className={showInfo ? "active" : ""} onClick={() => setShowInfo(!showInfo)}><Info size={13} /> Información</button>
      </div>
      {!structure.removable && <small className="dissection-locked-copy">Esta superficie no puede retirarse porque todo el corazón está unido en la misma malla.</small>}
      {showInfo && <dl className="dissection-info-grid">
        <div><dt>Ubicación</dt><dd>{structure.info.location}</dd></div>
        <div><dt>Función</dt><dd>{structure.info.function}</dd></div>
        {structure.info.note && <div><dt>Nota del modelo</dt><dd>{structure.info.note}</dd></div>}
      </dl>}
    </section>
  );
}
