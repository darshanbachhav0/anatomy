"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  CircleDashed,
  Layers3,
  Maximize2,
  RotateCcw,
  ScanLine,
  Scissors,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { Hotspot, Organ } from "../lib/anatomy-data";
import type { AnatomyViewer } from "../lib/three/viewer";
import { getDissectionConfig } from "../lib/dissection-data";
import { EMPTY_DISSECTION_SNAPSHOT, type DissectionSnapshot } from "../lib/three/dissection-engine";
import { DissectionPanel } from "./dissection/DissectionPanel";

type Props = {
  organ: Organ;
  autoRotate: boolean;
  onAutoRotate: (enabled: boolean) => void;
  compare: boolean;
  onCompare: () => void;
  showTips: boolean;
  onOpenAtlas?: () => void;
};

export function OrganViewer({ organ, autoRotate, onAutoRotate, compare, onCompare, showTips, onOpenAtlas }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<AnatomyViewer | null>(null);
  const organRef = useRef(organ);
  const autoRotateRef = useRef(autoRotate);
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [slowLoad, setSlowLoad] = useState(false);
  const [activeTools, setActiveTools] = useState<Set<string>>(() => new Set());
  const [dissection, setDissection] = useState<DissectionSnapshot>(EMPTY_DISSECTION_SNAPSHOT);
  const dissectionConfig = getDissectionConfig(organ.id);

  // A typical organ is ready well inside a second — flashing a loading panel for
  // that reads as jank. It only appears if the fetch is genuinely slow; the flag
  // is cleared by onLoading when the next load starts.
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setSlowLoad(true), 900);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    organRef.current = organ;
  }, [organ]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    let cancelled = false;
    let viewer: AnatomyViewer | null = null;

    void import("../lib/three/viewer").then(({ AnatomyViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(mountRef.current, {
        onSelect: setSelected,
        onLoading: (isLoading, value) => {
          setLoading(isLoading);
          setProgress(value);
          if (isLoading) setSlowLoad(false);
        },
        onDissectionChange: (snapshot) => {
          setDissection(snapshot);
          if (!snapshot.enabled) setActiveTools((current) => {
            if (!current.has("dissection")) return current;
            const next = new Set(current);
            next.delete("dissection");
            return next;
          });
        },
      });
      viewerRef.current = viewer;
      viewer.setAutoRotate(autoRotateRef.current);
      const current = organRef.current;
      viewer.setOrgan(current.model, current.hotspots, current.accent, getDissectionConfig(current.id)).catch(() => {
        setLoading(false);
        setProgress(0);
      });
    });

    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.dispose();
    };
  }, []);

  useEffect(() => {
    viewerRef.current?.setOrgan(organ.model, organ.hotspots, organ.accent, getDissectionConfig(organ.id)).catch(() => {
      setLoading(false);
      setProgress(0);
    });
  }, [organ]);

  useEffect(() => viewerRef.current?.setAutoRotate(autoRotate), [autoRotate]);

  // The viewer drives the callout's position directly, so a spinning model
  // never costs a React render.
  const calloutRef = useCallback((node: HTMLDivElement | null) => {
    viewerRef.current?.attachCallout(node);
  }, []);

  const handleTool = (tool: string) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (tool === "rotate") onAutoRotate(!autoRotate);
    if (tool === "zoom") viewer.zoom(-1);
    const setToolEnabled = (id: string, enabled: boolean) => setActiveTools((current) => {
      const next = new Set(current);
      if (enabled) next.add(id); else next.delete(id);
      return next;
    });
    if (tool === "isolate") setToolEnabled(tool, viewer.toggleIsolate());
    if (tool === "section") setToolEnabled(tool, viewer.toggleCrossSection());
    if (tool === "layers") setToolEnabled(tool, viewer.toggleLayers());
    if (tool === "dissection" && dissectionConfig) {
      viewer.clearSelection();
      setToolEnabled(tool, viewer.setDissectionEnabled(!dissection.enabled));
    }
    if (tool === "compare") onCompare();
    if (tool === "reset") {
      viewer.reset();
    }
  };

  const tools = [
    { id: "rotate", label: "Girar", icon: RotateCcw },
    { id: "zoom", label: "Acercar", icon: Search },
    { id: "isolate", label: "Aislar", icon: CircleDashed },
    { id: "section", label: "Corte", icon: ScanLine },
    { id: "layers", label: "Capas", icon: Layers3 },
    { id: "dissection", label: "Disección", icon: Scissors },
    { id: "compare", label: "Comparar", icon: Box },
    { id: "reset", label: "Reiniciar", icon: RotateCcw },
  ];

  const accessibleHotspots = organ.hotspots.filter((hotspot) => {
    if (!dissection.enabled) return hotspot.visibleInNormalMode !== false;
    if (hotspot.visibleInDissection === false) return false;
    if (hotspot.requiredStage != null && dissection.activeStage < hotspot.requiredStage) return false;
    return hotspot.requiredRemovedStructures?.every((id) => dissection.removedStructureIds.includes(id)) ?? true;
  });

  return (
    <section className="viewer-shell" aria-label={`Visor interactivo de ${organ.name}`}>
      <div className="viewer-glow" style={{ "--organ-accent": organ.accent } as React.CSSProperties} />
      <div ref={mountRef} className="three-mount" />

      <div className="viewer-tools" aria-label="Herramientas del visor 3D">
        {tools.map(({ id, label, icon: Icon }) => {
          const unavailable = id === "dissection" && !dissectionConfig;
          const pressed = activeTools.has(id) || (id === "compare" && compare);
          return (
          <button
            key={id}
            type="button"
            className={`tool-button ${pressed ? "active" : ""}`}
            onClick={() => handleTool(id)}
            aria-pressed={pressed}
            disabled={unavailable}
            aria-label={unavailable ? `Disección próximamente disponible para ${organ.name}` : label}
            title={unavailable ? `Disección próximamente disponible para ${organ.name}` : label}
          >
            <Icon size={19} strokeWidth={1.65} />
            <span>{label}</span>
          </button>
        );})}
      </div>

      {showTips && !dissection.enabled && <aside className="tip-note" aria-label="Instrucciones del visor">
        <span><Sparkles size={15} /> Consejo</span>
        <p>Arrastra para girar<br />Desplázate para acercar<br />Pulsa un punto para aprender</p>
      </aside>}

      {selected && (
        <div className="hotspot-callout" ref={calloutRef} data-side="right">
          <div className="callout-body" style={{ "--hotspot-color": selected.color } as React.CSSProperties}>
            <button className="callout-close" type="button" onClick={() => viewerRef.current?.clearSelection()} aria-label="Cerrar">
              <X size={13} />
            </button>
            <b>{selected.label}</b>
            <small>{selected.detail}</small>
          </div>
        </div>
      )}

      {dissection.enabled && dissectionConfig && <DissectionPanel
        onOpenAtlas={onOpenAtlas}
        config={dissectionConfig}
        state={dissection}
        onSelect={(structureId) => viewerRef.current?.selectDissectionStructure(structureId)}
        onRemove={(structureId) => viewerRef.current?.removeDissectionStructure(structureId)}
        onRestore={(structureId) => viewerRef.current?.restoreDissectionStructure(structureId)}
        onIsolate={(structureId) => viewerRef.current?.isolateDissectionStructure(structureId)}
        onFocus={(structureId) => viewerRef.current?.focusDissectionStructure(structureId)}
        onUndo={() => viewerRef.current?.undoDissection()}
        onRedo={() => viewerRef.current?.redoDissection()}
        onReset={() => viewerRef.current?.resetDissection()}
        onStage={(stage) => viewerRef.current?.setDissectionStage(stage)}
        onExit={() => viewerRef.current?.setDissectionEnabled(false)}
      />}

      {/* Screen-reader equivalent of the dots, which live in the canvas. */}
      <ul className="hotspot-index">
        {accessibleHotspots.map((hotspot) => (
          <li key={hotspot.id}>{hotspot.label}: {hotspot.detail}</li>
        ))}
      </ul>

      {loading && slowLoad && (
        <div className="model-loader" role="status" aria-live="polite">
          <div className="loader-orbit"><Maximize2 size={20} /></div>
          <strong>Preparando el modelo de {organ.name}</strong>
          <span>{Math.max(8, Math.round(progress * 100))}%</span>
        </div>
      )}

      <button className="auto-rotate" type="button" onClick={() => onAutoRotate(!autoRotate)} aria-pressed={autoRotate}>
        <RotateCcw size={14} /> Giro automático
        <span className={`switch ${autoRotate ? "on" : ""}`}><i /></span>
      </button>

      <div className="view-caption">
        <span>{dissection.enabled ? "Modo disección activo · selecciona la superficie" : "Modelo 3D · pulsa un punto para explorar"}</span>
        <strong>{organ.scientificName}</strong>
      </div>
    </section>
  );
}
