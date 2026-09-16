import Link from 'next/link';

export default function NotFound() {
  return <main className="app-shell"><section className="content-view" aria-labelledby="not-found-title">
    <span className="content-kicker">Atlas Anatómico UMA</span>
    <h1 id="not-found-title">No encontramos esta página</h1>
    <p>Es posible que la dirección haya cambiado. Regresa al inicio para continuar explorando.</p>
    <Link className="primary-action" href="/">Volver al inicio</Link>
  </section></main>;
}
