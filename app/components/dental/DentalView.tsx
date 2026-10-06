"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, LoaderCircle, Maximize2, RotateCcw } from "lucide-react";
import "./dental.css";

const VIEWER_URL = "/dental/index.html?lang=es";

export default function DentalView() {
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setStatus("error"), 30000);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "uma-dental-ready" || event.data?.type === "uma-dental-error") {
        window.clearTimeout(timeout);
        setStatus(event.data.type === "uma-dental-ready" ? "ready" : "error");
      }
    };
    window.addEventListener("message", receive);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("message", receive);
    };
  }, [attempt]);

  const retry = () => { setStatus("loading"); setAttempt(value => value + 1); };
  const fullscreen = async () => {
    try {
      await stage.current?.requestFullscreen();
    } catch {
      setNotice("Tu navegador no permite la pantalla completa. Puedes usar «Abrir visor».");
    }
  };

  return <section className="dental-view" aria-labelledby="dental-title">
    <header className="dental-heading">
      <div><h1 id="dental-title">Odontología</h1><p>Explora la dentición, los tejidos y la anatomía interna de cada diente.</p></div>
      <div className="dental-actions">
        <button type="button" onClick={fullscreen}><Maximize2 size={16} /> Pantalla completa</button>
        <a href={VIEWER_URL} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> Abrir visor</a>
      </div>
    </header>
    {notice && <p className="dental-notice" role="status">{notice}</p>}
    <div className="dental-frame-shell" ref={stage}>
      <iframe key={attempt} ref={frame} src={VIEWER_URL} title="Atlas dental 3D de UMA en español" allowFullScreen onError={() => setStatus("error")} />
      {status !== "ready" && <div className="dental-status" role="status" aria-live="polite">
        {status === "loading" ? <><LoaderCircle className="dental-spinner" size={28} /><h2>Preparando el atlas dental…</h2><p>Cargando el visor y el catálogo de estructuras.</p></> : <>
          <h2>No se pudo iniciar el atlas dental</h2>
          <p>Comprueba tu conexión y que tu navegador tenga WebGL habilitado.</p>
          <button type="button" onClick={retry}><RotateCcw size={16} /> Reintentar</button>
          <a href={VIEWER_URL} target="_blank" rel="noopener noreferrer">Abrir el visor en otra pestaña</a>
        </>}
      </div>}
    </div>
    <footer className="dental-credit">
      <span>Adaptado de <a href="https://github.com/Yoosseph/dental-scope" target="_blank" rel="noopener noreferrer">Dental Scope</a> · Yoseph y colaboradores</span>
      <span>Modelos: BodyParts3D / Z-Anatomy · <a href="/dental/CREDITS.md" target="_blank" rel="noopener noreferrer">Créditos y licencias</a></span>
    </footer>
  </section>;
}
