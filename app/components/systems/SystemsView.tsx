import { ArrowLeft, ArrowRight, Box, HeartPulse } from "lucide-react";
import { organs, type OrganId } from "../../lib/anatomy-data";
import { anatomySystems } from "../../lib/system-data";
import { OrganArt } from "../shared/OrganArt";

export function SystemsView({
  selectedSystem,
  onSelectSystem,
  onViewOrgan,
}: {
  selectedSystem: string | null;
  onSelectSystem: (systemId: string | null) => void;
  onViewOrgan: (organId: OrganId) => void;
}) {
  const system = anatomySystems.find((item) => item.id === selectedSystem);

  if (system) {
    const available = organs.filter((organ) => organ.system === system.name);
    return (
      <section className="content-view system-detail" aria-labelledby="system-detail-title">
        <button className="back-action" type="button" onClick={() => onSelectSystem(null)}><ArrowLeft size={16} /> Todos los sistemas</button>
        <header className="content-hero">
          <span className="content-kicker">{system.icon} Sistema anatómico</span>
          <h1 id="system-detail-title">{system.name}</h1>
          <p>{system.description}</p>
        </header>
        <div className="system-fact-grid">
          <article><span>Función principal</span><p>{system.primaryFunction}</p></article>
          <article><span>Relación entre órganos</span><p>{system.relationship}</p></article>
          <article><span>Datos importantes</span><ul>{system.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></article>
        </div>
        <div className="section-heading"><div><span>Modelos disponibles</span><h2>Órganos del sistema</h2></div><small>{available.length} {available.length === 1 ? "órgano" : "órganos"}</small></div>
        <div className="resource-grid compact-grid">
          {available.map((organ) => (
            <article className="resource-card" key={organ.id}>
              <span className="resource-art"><OrganArt organ={organ} asset="thumb" alt={`Modelo de ${organ.name}`} /></span>
              <div><small>{organ.scientificName}</small><h3>{organ.name}</h3><p>{organ.function}</p></div>
              <button className="card-primary" type="button" onClick={() => onViewOrgan(organ.id)}>Ver órgano en 3D <ArrowRight size={14} /></button>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="content-view" aria-labelledby="systems-title">
      <header className="content-hero">
        <span className="content-kicker"><HeartPulse size={15} /> Anatomía por sistemas</span>
        <h1 id="systems-title">Sistemas del cuerpo humano</h1>
        <p>Comprende cómo los órganos se organizan y colaboran para mantener las funciones vitales.</p>
      </header>
      <div className="system-grid">
        {anatomySystems.map((systemItem) => {
          const available = organs.filter((organ) => organ.system === systemItem.name);
          return (
            <article className="system-card-full" key={systemItem.id}>
              <header><span>{systemItem.icon}</span><small>{available.length} {available.length === 1 ? "modelo disponible" : "modelos disponibles"}</small></header>
              <h2>{systemItem.name}</h2>
              <p>{systemItem.description}</p>
              <div className="system-organs">
                <b>Órganos disponibles</b>
                {available.map((organ) => <button type="button" key={organ.id} onClick={() => onViewOrgan(organ.id)}>{organ.name}</button>)}
              </div>
              <button className="card-primary" type="button" onClick={() => onSelectSystem(systemItem.id)}><Box size={14} /> Explorar sistema <ArrowRight size={14} /></button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
