"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Maximize2, RotateCcw } from "lucide-react";
import "./study-atlas.css";

export default function StudyAtlasView({ mode }: { mode: "explore" | "motion" }) {
  const title = mode === "motion" ? "Movimientos" : "Exploración";
  const url = `/study-atlas/index.html?mode=${mode}`;
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // Model loading continues inside the viewer with its own progress and retry UI.
    const timeout = window.setTimeout(() => setStatus("error"), 45000);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type !== "uma-study-ready" && event.data?.type !== "uma-study-error") return;
      window.clearTimeout(timeout);
      setStatus(event.data.type === "uma-study-ready" ? "ready" : "error");
    };
    window.addEventListener("message", receive);
    return () => { window.clearTimeout(timeout); window.removeEventListener("message", receive); };
  }, [attempt]);

  const fullscreen = async () => {
    try { await stage.current?.requestFullscreen(); }
    catch { setNotice("Tu navegador no permite la pantalla completa. Puedes usar «Abrir visor»."); }
  };

  return <section className="study-atlas-view" aria-labelledby="study-atlas-title">
    <header className="study-atlas-heading">
      <div><h1 id="study-atlas-title">{title}</h1><p>{mode === "motion"
        ? "Estudia 58 movimientos anatómicos: filtra por región, pausa y ajusta la velocidad."
        : "Explora el cuerpo humano, sus sistemas y preparaciones; selecciona, aísla y observa cada estructura."}</p></div>
      <div className="study-atlas-actions">
        <button type="button" onClick={fullscreen}><Maximize2 size={16} /> Pantalla completa</button>
        <a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> Abrir visor</a>
      </div>
    </header>
    {notice && <p role="status">{notice}</p>}
    <div className="study-atlas-stage" ref={stage}>
      <iframe key={attempt} ref={frame} src={`${url}&embedded=1`} title={mode === "motion" ? "Movimientos anatómicos 3D en español" : "Exploración anatómica 3D en español"} allowFullScreen onError={() => setStatus("error")} />
      {status !== "ready" && <div className="study-atlas-status" role="status">
        <h2>{status === "loading" ? "Preparando el simulador…" : "No se pudo iniciar el simulador"}</h2>
        <p>{status === "loading" ? "Cargando el visor y el catálogo anatómico." : "Comprueba la conexión y la aceleración gráfica de tu navegador."}</p>
        {status === "error" && <button type="button" onClick={() => { setStatus("loading"); setAttempt(value => value + 1); }}><RotateCcw size={16} /> Reintentar</button>}
      </div>}
    </div>
    <p className="study-atlas-note">Material educativo. Los movimientos reproducen las animaciones del recurso original; no son una simulación biomecánica calculada.</p>
  </section>;
}
