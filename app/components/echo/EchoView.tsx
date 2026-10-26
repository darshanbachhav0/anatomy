"use client";
import "./echo.css";

export default function EchoView() {
  return (
    <section className="uma-echo-module" aria-label="Laboratorio de ecocardiografía UMA">
      <iframe
        src="/echo/index.html"
        title="Simulador de ecocardiografía 3D UMA"
        allow="fullscreen"
        allowFullScreen
      />
    </section>
  );
}
