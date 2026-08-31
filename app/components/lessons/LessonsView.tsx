"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Circle, CircleDot, Cuboid, Trophy } from "lucide-react";
import { organById, organs, type OrganId } from "../../lib/anatomy-data";
import { getLessonContent, lessonKey, lessonModules } from "../../lib/lesson-data";
import type { LessonStatus } from "../../lib/storage";
import { OrganArt } from "../shared/OrganArt";
import { Quiz } from "./Quiz";

type ActiveLesson = { organId: OrganId; moduleIndex: number };

function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === "completed") return <Check size={14} />;
  if (status === "progress") return <CircleDot size={14} />;
  return <Circle size={14} />;
}

export function LessonsView({
  selectedOrganId,
  progress,
  quizScores,
  onSetProgress,
  onSaveQuiz,
  onViewOrgan,
  onNotify,
}: {
  selectedOrganId: OrganId;
  progress: Record<string, LessonStatus>;
  quizScores: Partial<Record<OrganId, number>>;
  onSetProgress: (lessonId: string, status: LessonStatus) => void;
  onSaveQuiz: (organId: OrganId, score: number) => void;
  onViewOrgan: (organId: OrganId) => void;
  onNotify: (message: string) => void;
}) {
  const [active, setActive] = useState<ActiveLesson | null>(null);

  const openLesson = (organId: OrganId, moduleIndex: number) => setActive({ organId, moduleIndex });

  if (active) {
    const activeModule = lessonModules[active.moduleIndex];
    const key = lessonKey(active.organId, activeModule.id);
    const status = progress[key] ?? "pending";
    return (
      <LessonDetail
        organId={active.organId}
        moduleIndex={active.moduleIndex}
        status={status}
        onBack={() => setActive(null)}
        onNavigate={(moduleIndex) => setActive({ ...active, moduleIndex })}
        onStart={() => status === "pending" && onSetProgress(key, "progress")}
        onComplete={() => {
          onSetProgress(key, "completed");
          onNotify("Lección completada");
        }}
        onQuizComplete={(score) => {
          onSaveQuiz(active.organId, score);
          onSetProgress(key, "completed");
          onNotify("Progreso actualizado");
        }}
        onViewOrgan={() => onViewOrgan(active.organId)}
      />
    );
  }

  const totalCompleted = Object.values(progress).filter((status) => status === "completed").length;
  const totalLessons = organs.length * lessonModules.length;
  const percent = Math.round((totalCompleted / totalLessons) * 100);

  return (
    <section className="content-view" aria-labelledby="lessons-title">
      <header className="content-hero content-hero-row">
        <div><span className="content-kicker"><BookOpen size={15} /> Aprendizaje guiado</span><h1 id="lessons-title">Lecciones de anatomía</h1><p>Avanza a tu ritmo y conecta cada concepto con el modelo tridimensional.</p></div>
        <div className="overall-progress"><b>{percent}%</b><span>Progreso de aprendizaje</span><i><em style={{ width: `${percent}%` }} /></i><small>{totalCompleted} de {totalLessons} lecciones completadas</small></div>
      </header>
      <div className="lesson-organ-grid">
        {organs.map((organ) => {
          const completed = lessonModules.filter((module) => progress[lessonKey(organ.id, module.id)] === "completed").length;
          const firstOpen = lessonModules.findIndex((module) => progress[lessonKey(organ.id, module.id)] !== "completed");
          return (
            <article className={`lesson-organ-card ${selectedOrganId === organ.id ? "selected" : ""}`} key={organ.id}>
              <header><span><OrganArt organ={organ} asset="thumb" alt="" /></span><div><small>{organ.system}</small><h2>{organ.name}</h2></div><b>{completed}/{lessonModules.length}</b></header>
              <div className="lesson-module-list">
                {lessonModules.map((module, index) => {
                  const status = progress[lessonKey(organ.id, module.id)] ?? "pending";
                  return <button type="button" key={module.id} onClick={() => openLesson(organ.id, index)} className={status}><span>{module.number}</span><b>{module.label}</b><StatusIcon status={status} /></button>;
                })}
              </div>
              <button className="card-primary" type="button" onClick={() => openLesson(organ.id, firstOpen < 0 ? 0 : firstOpen)}>Continuar <ArrowRight size={14} /></button>
              {quizScores[organ.id] !== undefined && <small className="best-score"><Trophy size={12} /> Mejor cuestionario: {quizScores[organ.id]}%</small>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LessonDetail({
  organId,
  moduleIndex,
  status,
  onBack,
  onNavigate,
  onStart,
  onComplete,
  onQuizComplete,
  onViewOrgan,
}: {
  organId: OrganId;
  moduleIndex: number;
  status: LessonStatus;
  onBack: () => void;
  onNavigate: (index: number) => void;
  onStart: () => void;
  onComplete: () => void;
  onQuizComplete: (score: number) => void;
  onViewOrgan: () => void;
}) {
  const organ = organById[organId];
  const activeModule = lessonModules[moduleIndex];
  const content = useMemo(() => getLessonContent(organ, activeModule), [organ, activeModule]);

  useEffect(() => {
    onStart();
  }, [organId, activeModule.id, onStart]);

  return (
    <section className="content-view lesson-detail" aria-labelledby="lesson-title">
      <button className="back-action" type="button" onClick={onBack}><ArrowLeft size={16} /> Volver a lecciones</button>
      <div className="lesson-detail-layout">
        <aside className="lesson-outline">
          <span className="resource-art"><OrganArt organ={organ} asset="thumb" alt={`Miniatura de ${organ.name}`} /></span>
          <small>{organ.system}</small><h2>{organ.name}</h2>
          {lessonModules.map((item, index) => <button type="button" key={item.id} className={index === moduleIndex ? "active" : ""} onClick={() => onNavigate(index)}><span>{item.number}</span>{item.label}</button>)}
        </aside>
        <article className="lesson-content">
          <span className="content-kicker">Lección {activeModule.number} · {status === "completed" ? "Completada" : status === "progress" ? "En progreso" : "Pendiente"}</span>
          <h1 id="lesson-title">{content.title}</h1>
          {activeModule.id === "quiz" ? <Quiz organ={organ} onComplete={onQuizComplete} onBack={onBack} /> : <>
            <section><h2>Objetivos de aprendizaje</h2><ul>{content.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></section>
            {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <aside className="lesson-fact"><b>Conexión anatómica</b><p>{content.facts[0]}</p></aside>
            <div className="detail-actions">
              <button type="button" className="secondary-action" onClick={onViewOrgan}><Cuboid size={15} /> Ver en modelo 3D</button>
              {status !== "completed" && <button type="button" className="primary-action" onClick={onComplete}><Check size={15} /> Marcar completada</button>}
            </div>
          </>}
          <footer className="lesson-pagination">
            <button type="button" onClick={() => onNavigate(moduleIndex - 1)} disabled={moduleIndex === 0}><ArrowLeft size={14} /> Anterior</button>
            <button type="button" onClick={() => onNavigate(moduleIndex + 1)} disabled={moduleIndex === lessonModules.length - 1}>Siguiente <ArrowRight size={14} /></button>
          </footer>
        </article>
      </div>
    </section>
  );
}
