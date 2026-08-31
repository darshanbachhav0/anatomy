import { BookOpenCheck, Heart, NotebookPen, ScanSearch, TrendingUp, Trophy } from "lucide-react";
import { organs, type OrganId } from "../../lib/anatomy-data";
import { lessonKey, lessonModules } from "../../lib/lesson-data";
import type { StudentData } from "../../lib/storage";

export function ProgressView({ data, onViewOrgan }: { data: StudentData; onViewOrgan: (organId: OrganId) => void }) {
  const completed = Object.values(data.lessonProgress).filter((status) => status === "completed").length;
  const totalLessons = organs.length * lessonModules.length;
  const scores = Object.values(data.quizScores).filter((score): score is number => typeof score === "number");
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  const metrics = [
    { label: "Lecciones completadas", value: `${completed} / ${totalLessons}`, icon: BookOpenCheck },
    { label: "Cuestionarios", value: `${scores.length} realizados`, icon: Trophy },
    { label: "Promedio de cuestionarios", value: `${average}%`, icon: TrendingUp },
    { label: "Órganos explorados", value: `${data.exploredOrgans.length} / ${organs.length}`, icon: ScanSearch },
    { label: "Favoritos", value: String(data.favorites.length), icon: Heart },
    { label: "Apuntes", value: String(data.notes.length), icon: NotebookPen },
  ];

  return (
    <section className="content-view" aria-labelledby="progress-title">
      <header className="content-hero"><span className="content-kicker"><TrendingUp size={15} /> Seguimiento personal</span><h1 id="progress-title">Mi progreso</h1><p>Tus resultados se calculan a partir de lecciones, cuestionarios y actividades realizadas en este dispositivo.</p></header>
      {completed === 0 && scores.length === 0 && data.exploredOrgans.length === 0 ? <div className="empty-state compact-empty"><span><BookOpenCheck size={24} /></span><h2>Empieza una lección para registrar tu progreso.</h2><p>También aparecerán aquí tus órganos explorados y mejores cuestionarios.</p></div> : <>
        <div className="metric-grid">{metrics.map(({ label, value, icon: Icon }) => <article key={label}><Icon size={18} /><span>{label}</span><b>{value}</b></article>)}</div>
        <div className="section-heading"><div><span>Progreso por órgano</span><h2>Tu recorrido anatómico</h2></div></div>
        <div className="organ-progress-list">{organs.map((organ) => {
          const lessonCompleted = lessonModules.filter((module) => data.lessonProgress[lessonKey(organ.id, module.id)] === "completed").length;
          const percent = lessonCompleted ? Math.round((lessonCompleted / lessonModules.length) * 100) : data.exploredOrgans.includes(organ.id) ? 10 : 0;
          return <button type="button" key={organ.id} onClick={() => onViewOrgan(organ.id)}><span>{organ.name}<small>{lessonCompleted} lecciones completadas</small></span><i><em style={{ width: `${percent}%` }} /></i><b>{percent}%</b></button>;
        })}</div>
      </>}
    </section>
  );
}
