"use client";

import { ChevronDown, Redo2, RotateCcw, Scissors, Undo2, X } from "lucide-react";
import { useState } from "react";
import type { DissectionConfig } from "../../lib/dissection-data";
import type { DissectionSnapshot } from "../../lib/three/dissection-engine";
import { StructureInfo } from "./StructureInfo";

export function DissectionPanel({
  config,
  state,
  onSelect,
  onRemove,
  onRestore,
  onIsolate,
  onFocus,
  onUndo,
  onRedo,
  onReset,
  onStage,
  onExit,
  onOpenAtlas,
}: {
  config: DissectionConfig;
  state: DissectionSnapshot;
  onSelect: (structureId: string) => void;
  onRemove: (structureId: string) => void;
  onRestore: (structureId: string) => void;
  onIsolate: (structureId: string) => void;
  onFocus: (structureId: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onStage: (stage: number) => void;
  onExit: () => void;
  onOpenAtlas?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const selected = config.structures.find((item) => item.id === state.selectedStructureId) ?? null;

  return (
    <aside className={`dissection-panel ${collapsed ? "collapsed" : ""}`} aria-label="Panel del modo disección">
      <header>
        <div><span><Scissors size={14} /> Modo disección activo</span><strong>{config.organLabel}</strong></div>
        <button type="button" className="dissection-collapse" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed} aria-label={collapsed ? "Expandir panel de disección" : "Contraer panel de disección"}><ChevronDown size={17} /></button>
      </header>
      {!collapsed && <div className="dissection-panel-body">
        <p>Selecciona una estructura del modelo o de esta lista para examinarla.</p>
        <div className="dissection-model-warning" role="note">
          <b>Modelo de superficie unificada</b>
          <span>{config.modelReport.limitation}</span>
          {onOpenAtlas && <button type="button" className="card-primary" onClick={onOpenAtlas}>Abrir corazón con piezas independientes</button>}
        </div>

        <section className="dissection-stages" aria-labelledby="dissection-level-title">
          <h3 id="dissection-level-title">Nivel</h3>
          {config.stages.map((stage) => <button type="button" key={stage.id} className={state.activeStage === stage.id ? "active" : ""} onClick={() => onStage(stage.id)}><i /> <span><b>{stage.id} · {stage.label}</b><small>{stage.description}</small></span></button>)}
        </section>

        <section className="dissection-structures" aria-labelledby="dissection-structures-title">
          <h3 id="dissection-structures-title">Estructuras</h3>
          {config.structures.map((structure) => {
            const removed = state.removedStructureIds.includes(structure.id);
            const available = state.availableStructureIds.includes(structure.id);
            return <button type="button" key={structure.id} className={`${state.selectedStructureId === structure.id ? "active" : ""} ${removed ? "removed" : ""}`} onClick={() => onSelect(structure.id)} disabled={!available}><span>{removed ? "✓" : "●"}</span><b>{structure.label}</b><small>{removed ? "Retirada" : available ? structure.removable ? "Disponible" : "Malla unificada" : "No encontrada"}</small></button>;
          })}
        </section>

        {selected && <StructureInfo
          key={selected.id}
          structure={selected}
          available={state.availableStructureIds.includes(selected.id)}
          removed={state.removedStructureIds.includes(selected.id)}
          isolated={state.isolatedStructureId === selected.id}
          onRemove={() => onRemove(selected.id)}
          onRestore={() => onRestore(selected.id)}
          onIsolate={() => onIsolate(selected.id)}
          onFocus={() => onFocus(selected.id)}
        />}

        <footer>
          <div><button type="button" onClick={onUndo} disabled={!state.canUndo}><Undo2 size={14} /> Deshacer</button><button type="button" onClick={onRedo} disabled={!state.canRedo}><Redo2 size={14} /> Rehacer</button></div>
          <button type="button" onClick={onReset}><RotateCcw size={14} /> Restablecer disección</button>
          <button type="button" className="dissection-exit" onClick={onExit}><X size={14} /> Salir de disección</button>
        </footer>
      </div>}
    </aside>
  );
}
