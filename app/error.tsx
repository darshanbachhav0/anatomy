"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="app-shell"><section className="content-view" role="alert" aria-labelledby="page-error-title">
    <span className="content-kicker">Atlas Anatómico UMA</span>
    <h1 id="page-error-title">No pudimos cargar esta página</h1>
    <p>Ocurrió un problema al abrir el contenido. Puedes intentarlo nuevamente; tus apuntes guardados no se borrarán.</p>
    <button type="button" className="primary-action" onClick={reset}>Intentar nuevamente</button>
  </section></main>;
}
