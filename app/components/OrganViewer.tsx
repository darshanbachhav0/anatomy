"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, ScanLine } from "lucide-react";
import { organPhrase, type Organ } from "../lib/anatomy-data";
import type { AnatomyViewer } from "../lib/three/viewer";

type Props = {
  organ: Organ;
  autoRotate: boolean;
};

export function OrganViewer({ organ, autoRotate }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<AnatomyViewer | null>(null);
  const organRef = useRef(organ);
  const autoRotateRef = useRef(autoRotate);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [slowLoad, setSlowLoad] = useState(false);
  const [sectionAndLayersEnabled, setSectionAndLayersEnabled] = useState(false);

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

  // The explorer shows the bare organ: no labelled hotspot dots are attached.
  useEffect(() => {
    let cancelled = false;
    let viewer: AnatomyViewer | null = null;

    void import("../lib/three/viewer").then(({ AnatomyViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(mountRef.current, {
        onSelect: () => {},
        onLoading: (isLoading, value) => {
          setLoading(isLoading);
          setProgress(value);
          if (isLoading) setSlowLoad(false);
        },
        onDissectionChange: () => {},
      });
      viewerRef.current = viewer;
      viewer.setAutoRotate(autoRotateRef.current);
      const current = organRef.current;
      viewer.setOrgan(current.model, [], current.accent).catch(() => {
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
    viewerRef.current?.setOrgan(organ.model, [], organ.accent).catch(() => {
      setLoading(false);
      setProgress(0);
    });
  }, [organ]);

  useEffect(() => viewerRef.current?.setAutoRotate(autoRotate), [autoRotate]);

  const handleSectionAndLayers = () => {
    const viewer = viewerRef.current;
    if (!viewer || loading) return;
    setSectionAndLayersEnabled(viewer.toggleSectionAndLayers());
  };

  return (
    <section className="viewer-shell" aria-label={`Visor interactivo ${organPhrase(organ, "de")}`}>
      <div className="viewer-glow" style={{ "--organ-accent": organ.accent } as React.CSSProperties} />
      <div ref={mountRef} className="three-mount" />

      <div className="viewer-tools" aria-label="Herramientas del visor 3D">
          <button
            type="button"
            className={`tool-button ${sectionAndLayersEnabled ? "active" : ""}`}
            onClick={handleSectionAndLayers}
            aria-pressed={sectionAndLayersEnabled}
            aria-label="Corte y Capas"
            title="Corte y Capas"
            disabled={loading}
          >
            <ScanLine size={19} strokeWidth={1.65} />
            <span>Corte y Capas</span>
          </button>
      </div>

      {loading && slowLoad && (
        <div className="model-loader" role="status" aria-live="polite">
          <div className="loader-orbit"><Maximize2 size={20} /></div>
          <strong>Preparando el modelo {organPhrase(organ, "de")}</strong>
          <span>{Math.max(8, Math.round(progress * 100))}%</span>
        </div>
      )}

      <div className="view-caption">
        <span>Modelo 3D · arrastra para girar el órgano</span>
        <strong>{organ.scientificName}</strong>
      </div>
    </section>
  );
}
