import { ArrowRight, FileText, Heart } from "lucide-react";
import { organById, type OrganId } from "../../lib/anatomy-data";
import { OrganArt } from "../shared/OrganArt";

export function FavoritesView({ favorites, onViewOrgan, onOpenSheet, onRemove, onExplore }: { favorites: OrganId[]; onViewOrgan: (id: OrganId) => void; onOpenSheet: (id: OrganId) => void; onRemove: (id: OrganId) => void; onExplore: () => void }) {
  return (
    <section className="content-view" aria-labelledby="favorites-title">
      <header className="content-hero"><span className="content-kicker"><Heart size={15} /> Colección personal</span><h1 id="favorites-title">Mis favoritos</h1><p>Accede rápidamente a los órganos que guardaste desde Explorar o la Biblioteca.</p></header>
      {favorites.length === 0 ? <div className="empty-state"><span><Heart size={24} /></span><h2>Aún no tienes órganos favoritos.</h2><p>Guarda un órgano para revisarlo desde esta colección.</p><button type="button" className="primary-action" onClick={onExplore}>Explorar órganos</button></div> : <div className="resource-grid">{favorites.map((id) => {
        const organ = organById[id];
        return <article className="resource-card anatomy-card" key={id}><span className="resource-art"><OrganArt organ={organ} asset="thumb" alt={`Ilustración de ${organ.name}`} /></span><div><small>{organ.system}</small><h2>{organ.name}</h2><p>{organ.function}</p></div><div className="card-actions"><button type="button" onClick={() => onOpenSheet(id)}><FileText size={14} /> Ver ficha</button><button type="button" onClick={() => onViewOrgan(id)}>Ver en 3D <ArrowRight size={14} /></button><button type="button" className="active" onClick={() => onRemove(id)} aria-label={`Quitar ${organ.name} de favoritos`}><Heart size={14} fill="currentColor" /></button></div></article>;
      })}</div>}
    </section>
  );
}
