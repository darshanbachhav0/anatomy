"use client";
/* eslint-disable @next/next/no-img-element -- The local UMA logo is served as an already optimized static asset. */

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  Bookmark,
  BrainCircuit,
  CircleHelp,
  FileText,
  Heart,
  LibraryBig,
  Microscope,
  Play,
  Search,
  Share2,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { OrganViewer } from "./OrganViewer";
import { organById, organs, type Organ, type OrganId } from "../lib/anatomy-data";
import { useUmaStudentData } from "../hooks/useUmaStudentData";
import { MainNavigation, MobileNavigation, type MainView } from "./navigation/MainNavigation";
import { OrganArt } from "./shared/OrganArt";
import { Toast } from "./shared/Toast";
import { SystemsView } from "./systems/SystemsView";
import { LessonsView } from "./lessons/LessonsView";
import { LibraryView } from "./library/LibraryView";
import { AnatomySheet } from "./library/AnatomySheet";
import { NotesView } from "./notes/NotesView";
import { ProfileMenu } from "./navigation/ProfileMenu";
import { GlobalSearch } from "./navigation/GlobalSearch";
import { ProgressView } from "./profile/ProgressView";
import { FavoritesView } from "./profile/FavoritesView";
import { SettingsView } from "./profile/SettingsView";
import { AboutView } from "./profile/AboutView";
import { matchesSearch } from "../lib/search";

type Modal = "lesson" | "quiz" | "animation" | "system" | null;

export function AnatomyApp() {
  const student = useUmaStudentData();
  const { data } = student;
  const [activeView, setActiveView] = useState<MainView>("explore");
  const [organId, setOrganId] = useState<OrganId>("heart");
  const [compare, setCompare] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [query, setQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState("all");
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [sheetOrganId, setSheetOrganId] = useState<OrganId | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());
  const organ = organById[organId];
  const reference = organById[organId === "heart" ? "brain" : "heart"];
  const filteredOrgans = useMemo(
    () => organs.filter((item) =>
      matchesSearch(query, item.name, item.system)
      && (systemFilter === "all" || item.system === systemFilter)),
    [query, systemFilter],
  );

  useEffect(() => {
    if (!student.hydrated || !data.lastOrgan) return;
    const frame = window.requestAnimationFrame(() => setOrganId(data.lastOrgan as OrganId));
    return () => window.cancelAnimationFrame(frame);
  }, [student.hydrated, data.lastOrgan]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.48, stagger: 0.035, ease: "power2.out", overwrite: true },
    );
  }, [organId]);

  const selectOrgan = (id: OrganId) => {
    if (organById[id].illustrated) {
      ["organ", "microscopic", "compare", "location"].forEach((asset) => {
        const image = new Image();
        image.src = `/anatomy/${id}/${asset}.webp`;
      });
    }
    setOrganId(id);
    student.viewOrgan(id);
    setActiveView("explore");
    setMobileLibrary(false);
    setCompare(false);
  };

  const toggleFavorite = (id: OrganId) => {
    const removing = data.favorites.includes(id);
    student.toggleFavorite(id);
    setToast(removing ? "Eliminado de favoritos" : "Agregado a favoritos");
  };

  const viewLabels: Record<MainView, string> = {
    explore: "Explorar",
    systems: "Sistemas",
    lessons: "Lecciones",
    library: "Biblioteca",
    notes: "Apuntes",
    progress: "Mi progreso",
    favorites: "Mis favoritos",
    settings: "Configuración",
    about: "Acerca del simulador",
  };

  // Warms the model in the HTTP cache while the pointer is still travelling,
  // so the switch usually renders without a visible loading pass.
  const prefetchOrgan = (id: OrganId) => {
    if (id === organId || prefetched.current.has(id)) return;
    prefetched.current.add(id);
    void fetch(organById[id].model, { priority: "low" } as RequestInit).catch(() => {});
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setActiveView("explore")} aria-label="Inicio del Atlas Anatómico UMA">
          <span className="brand-mark"><img src="/uma-logo.jpg" alt="UMA Universidad María Auxiliadora" /></span>
          <span className="brand-copy"><strong>Atlas Anatómico 3D</strong><em>Facultad de Ciencias de la Salud</em></span>
        </button>
        <MainNavigation active={activeView} onNavigate={setActiveView} />
        <GlobalSearch
          onViewOrgan={selectOrgan}
          onViewSystem={(systemId) => { setSelectedSystem(systemId); setActiveView("systems"); }}
          onViewLesson={(id) => { setOrganId(id); setActiveView("lessons"); }}
          onOpenSheet={setSheetOrganId}
        />
        <ProfileMenu open={profileOpen} onOpenChange={setProfileOpen} onNavigate={setActiveView} />
        <button className="mobile-library-trigger" onClick={() => setMobileLibrary(true)} aria-label="Abrir biblioteca de órganos"><LibraryBig size={20} /></button>
      </header>

      {activeView === "explore" ? <>
      {student.hydrated && data.lastOrgan && (
        <section className="study-resume" aria-label="Historial de estudio">
          <button type="button" className="continue-study" onClick={() => selectOrgan(data.lastOrgan as OrganId)}>
            <span>Continuar estudiando</span>
            <strong>{organById[data.lastOrgan].name}</strong>
            <ArrowRight size={15} />
          </button>
          {data.recentOrgans.length > 0 && (
            <div className="recent-organs">
              <span>Vistos recientemente</span>
              {data.recentOrgans.map((id) => (
                <button type="button" key={id} onClick={() => selectOrgan(id)}>{organById[id].name}</button>
              ))}
            </div>
          )}
        </section>
      )}
      <div className="workspace">
        <aside className={`organ-library ${mobileLibrary ? "open" : ""}`}>
          <div className="panel-heading">
            <span>Biblioteca de órganos</span>
            <button aria-label="Cerrar biblioteca" className="mobile-close" onClick={() => setMobileLibrary(false)}><X size={17} /></button>
            <button
              aria-label={data.favorites.includes(organId) ? "Quitar de favoritos" : "Agregar a favoritos"}
              className={data.favorites.includes(organId) ? "is-favorite" : ""}
              onClick={() => toggleFavorite(organId)}
            ><Bookmark size={17} fill={data.favorites.includes(organId) ? "currentColor" : "none"} /></button>
          </div>
          <div className="organ-filters">
            <label>
              <Search size={14} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar órgano..." aria-label="Buscar órgano" />
            </label>
            <select value={systemFilter} onChange={(event) => setSystemFilter(event.target.value)} aria-label="Filtrar por sistema anatómico">
              <option value="all">Todos los sistemas</option>
              {[...new Set(organs.map((item) => item.system))].map((system) => <option key={system} value={system}>{system}</option>)}
            </select>
          </div>
          <div className="organ-list">
            {filteredOrgans.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`organ-item ${organId === item.id ? "active" : ""}`}
                onClick={() => selectOrgan(item.id)}
                onPointerEnter={() => prefetchOrgan(item.id)}
                onFocus={() => prefetchOrgan(item.id)}
                style={{ "--item-accent": item.accent } as React.CSSProperties}
              >
                <span className="organ-glyph">
                  <OrganArt organ={item} asset="thumb" alt={`Miniatura anatómica de ${item.name}`} size={47} />
                </span>
                <span><b>{item.name}</b><small>{item.system}</small></span>
                {data.favorites.includes(item.id) && <Heart className="favorite" size={14} fill="currentColor" />}
              </button>
            ))}
            {filteredOrgans.length === 0 && <div className="organ-empty"><Search size={20} /><p>No encontramos órganos con esos filtros.</p><button type="button" onClick={() => { setQuery(""); setSystemFilter("all"); }}>Limpiar filtros</button></div>}
          </div>
          <button className="view-all" onClick={() => setQuery("")}>Ver todos los órganos <ArrowRight size={14} /></button>
          <blockquote>
            <Sparkles size={18} />
            <p>Aprender es<br />un acto de curiosidad.</p>
            <em>¡Sigue explorando!</em>
          </blockquote>
        </aside>

        <OrganViewer
          organ={organ}
          autoRotate={data.settings.autoRotate}
          onAutoRotate={(enabled) => student.updateSettings({ autoRotate: enabled })}
          showTips={data.settings.showViewerTips}
          compare={compare}
          onCompare={() => setCompare(!compare)}
        />

        <aside className="info-panel" ref={contentRef}>
          <div className="info-kicker" data-reveal><Heart size={13} fill="currentColor" /> Órgano seleccionado</div>
          <div className="info-title-row" data-reveal>
            <div><h1>{organ.name}</h1><em>{organ.poetic}</em></div>
            <span className="specimen-stamp">
              <OrganArt organ={organ} asset="organ" alt={`Ilustración anatómica de ${organ.name}`} size={92} />
            </span>
          </div>
          <p className="description" data-reveal>{organ.description}</p>
          <div className="rule" />
          <h2 data-reveal>Datos esenciales</h2>
          <dl className="key-facts">
            <div data-reveal><dt><span>◇</span> Tamaño</dt><dd>{organ.size}</dd></div>
            <div data-reveal><dt><span>♙</span> Peso</dt><dd>{organ.weight}</dd></div>
            <div data-reveal><dt><span>⌁</span> Cada día</dt><dd>{organ.dailyFact}</dd></div>
            <div data-reveal><dt><span>⌖</span> Ubicación</dt><dd>{organ.location}</dd></div>
            <div data-reveal><dt><span>❋</span> Irrigación</dt><dd>{organ.bloodSupply}</dd></div>
            <div data-reveal><dt><span>◈</span> Función</dt><dd>{organ.function}</dd></div>
          </dl>
          <div className="medical-note" data-reveal><Stethoscope size={16} /><p><b>Importancia médica</b>{organ.medical}</p></div>
          <div className="fun-note" data-reveal><Sparkles size={15} /><p><b>¿Sabías que…?</b>{organ.funFact}</p></div>
          <button className={`favorite-button ${data.favorites.includes(organId) ? "active" : ""}`} onClick={() => toggleFavorite(organId)}>
            <Heart size={15} fill={data.favorites.includes(organId) ? "currentColor" : "none"} />
            {data.favorites.includes(organId) ? "En favoritos" : "Agregar a favoritos"}
          </button>
          <button className="lesson-button" data-reveal onClick={() => setModal("lesson")}>Ver lección <ArrowRight size={16} /></button>
          <div className="action-grid" data-reveal>
            <button onClick={() => setModal("animation")}><Play size={15} /> Animar</button>
            <button onClick={() => setModal("quiz")}><CircleHelp size={15} /> Evaluación</button>
            <button onClick={() => setCompare(!compare)} className={compare ? "active" : ""}><Share2 size={15} /> Comparar</button>
          </div>
        </aside>
      </div>

      {compare && (
        <section className="compare-strip" aria-label="Comparación de órganos">
          <div className="compare-organ"><OrganArt organ={organ} asset="thumb" alt="" /><span>Comparando</span><strong>{organ.name}</strong><small>{organ.system}</small></div>
          <b>con</b>
          <div className="compare-organ"><OrganArt organ={reference} asset="thumb" alt="" /><span>Referencia</span><strong>{reference.name}</strong><small>{reference.system}</small></div>
          <dl><div><dt>Función principal</dt><dd>{organ.function}</dd></div><div><dt>Tamaño</dt><dd>{organ.size}</dd></div></dl>
          <button onClick={() => setCompare(false)} aria-label="Cerrar comparación"><X size={16} /></button>
        </section>
      )}

      <section className="learning-cards" aria-label={`Recursos de aprendizaje sobre ${organ.name}`}>
        <article className="curiosity-card">
          <span>✦</span><p>Aprender es<br />un acto de curiosidad.</p><em>¡Sigue explorando!</em>
        </article>
        <article>
          <header><div><em>Vista microscópica</em><h3>{organ.tissue}</h3></div><Microscope size={17} /></header>
          <div className="microscope-visual organ-card-image"><OrganArt organ={organ} asset="microscopic" alt={`Vista microscópica del tejido de ${organ.name}`} /></div>
          <button onClick={() => setModal("lesson")}>Explorar tejido <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>Comparar órganos</em><h3>{organ.comparison}</h3></div><Share2 size={17} /></header>
          <div className="comparison-visual organ-card-image"><OrganArt organ={organ} asset="compare" alt={`Comparación anatómica: ${organ.comparison}`} /></div>
          <button onClick={() => setCompare(true)}>Abrir comparación <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>Función en movimiento</em><h3>{organ.function}</h3></div><Play size={17} /></header>
          {/* The artwork itself is the control, so the play badge inside it is
              decorative rather than a nested button. */}
          <button
            type="button"
            className="function-visual organ-card-image"
            onClick={() => setModal("animation")}
            aria-label={`Reproducir animación de la función de ${organ.name}`}
          >
            <OrganArt organ={organ} asset="organ" alt="" />
            <i className="function-pulse" />
            <span className="play-badge"><Play size={18} fill="currentColor" /></span>
          </button>
          <button onClick={() => setModal("animation")}>Reproducir animación <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>Notas clínicas</em><h3>Afecciones frecuentes</h3></div><FileText size={17} /></header>
          <ul>{organ.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul>
          <button onClick={() => setModal("lesson")}>Ver todas <ArrowRight size={14} /></button>
        </article>
        <article className="system-card">
          <header><div><em>Ubicación en el cuerpo</em><h3>{organ.system}</h3></div><BrainCircuit size={17} /></header>
          <button
            type="button"
            className="system-visual organ-card-image"
            onClick={() => setModal("system")}
            aria-label={`Ver la ubicación de ${organ.name} en el cuerpo`}
          >
            <OrganArt organ={organ} asset="location" alt="" />
          </button>
          <button onClick={() => setModal("system")}>Ver el sistema <ArrowRight size={14} /></button>
        </article>
      </section>
      </> : activeView === "systems" ? (
        <SystemsView selectedSystem={selectedSystem} onSelectSystem={setSelectedSystem} onViewOrgan={selectOrgan} />
      ) : activeView === "lessons" ? (
        <LessonsView
          selectedOrganId={organId}
          progress={data.lessonProgress}
          quizScores={data.quizScores}
          onSetProgress={student.setLessonStatus}
          onSaveQuiz={student.saveQuizScore}
          onViewOrgan={selectOrgan}
          onNotify={setToast}
        />
      ) : activeView === "library" ? (
        <LibraryView
          favorites={data.favorites}
          onToggleFavorite={toggleFavorite}
          onViewOrgan={selectOrgan}
          onOpenSheet={setSheetOrganId}
          onViewSystem={(systemId) => { setSelectedSystem(systemId); setActiveView("systems"); }}
        />
      ) : activeView === "notes" ? (
        <NotesView
          notes={data.notes}
          selectedOrganId={organId}
          confirmDelete={data.settings.confirmNoteDelete}
          onSave={student.saveNote}
          onDelete={student.deleteNote}
          onViewOrgan={selectOrgan}
          onNotify={setToast}
        />
      ) : activeView === "progress" ? (
        <ProgressView data={data} onViewOrgan={selectOrgan} />
      ) : activeView === "favorites" ? (
        <FavoritesView
          favorites={data.favorites}
          onViewOrgan={selectOrgan}
          onOpenSheet={setSheetOrganId}
          onRemove={toggleFavorite}
          onExplore={() => setActiveView("explore")}
        />
      ) : activeView === "settings" ? (
        <SettingsView
          settings={data.settings}
          onUpdate={student.updateSettings}
          onResetLearning={student.resetLearning}
          onClearAll={student.clearAll}
          onNotify={setToast}
        />
      ) : activeView === "about" ? (
        <AboutView />
      ) : (
        <section className="section-placeholder" aria-labelledby="section-title">
          <span>Plataforma de aprendizaje UMA</span>
          <h1 id="section-title">{viewLabels[activeView]}</h1>
          <p>Esta sección se integra con el órgano seleccionado y tu progreso local.</p>
          <button type="button" className="primary-action" onClick={() => setActiveView("explore")}>Volver al modelo 3D <ArrowRight size={16} /></button>
        </section>
      )}

      {modal && <LearningModal type={modal} organ={organ} onClose={() => setModal(null)} />}
      {sheetOrganId && (
        <AnatomySheet
          organ={organById[sheetOrganId]}
          favorite={data.favorites.includes(sheetOrganId)}
          onToggleFavorite={() => toggleFavorite(sheetOrganId)}
          onViewOrgan={() => { setSheetOrganId(null); selectOrgan(sheetOrganId); }}
          onClose={() => setSheetOrganId(null)}
        />
      )}
      {mobileLibrary && <button className="drawer-backdrop" aria-label="Cerrar biblioteca" onClick={() => setMobileLibrary(false)} />}
      <MobileNavigation active={activeView} onNavigate={setActiveView} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </main>
  );
}

const MODAL_ICON: Record<Exclude<Modal, null>, string> = {
  quiz: "?",
  animation: "▶",
  system: "⌖",
  lesson: "✦",
};

function LearningModal({ type, organ, onClose }: { type: Exclude<Modal, null>; organ: Organ; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const organName = organ.name;
  const title =
    type === "quiz" ? `Evaluación rápida: ${organName}`
    : type === "animation" ? `${organName} en movimiento`
    : type === "system" ? `${organName} en el cuerpo`
    : `Anatomía de ${organName.toLowerCase()}`;
  useEffect(() => {
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`learning-modal ${type === "system" ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        <span className="modal-icon">{MODAL_ICON[type]}</span>
        <em>Exploración guiada UMA</em>
        <h2 id="modal-title">{title}</h2>
        {type === "quiz" ? (
          <div className="quiz-options">
            <p>¿Qué enunciado describe mejor este órgano?</p>
            <button onClick={onClose}>Cumple una función especializada para mantener el organismo</button>
            <button onClick={onClose}>Trabaja de forma completamente independiente</button>
            <button onClick={onClose}>Solo se mantiene activo durante el sueño</button>
          </div>
        ) : type === "system" ? (
          <>
            <p>Ubicación: {organ.location}. Observa cómo se conecta con el resto del cuerpo.</p>
            {/* Shown whole rather than cropped into the circular demo — the
                point of this view is the figure and its vessels. */}
            <figure className="modal-figure">
              <OrganArt organ={organ} asset="location" alt={`${organName} ubicado en el ${organ.system.toLowerCase()}`} />
            </figure>
            <dl className="modal-facts">
              <div><dt>Sistema</dt><dd>{organ.system}</dd></div>
              <div><dt>Función principal</dt><dd>{organ.function}</dd></div>
              <div><dt>Irrigación</dt><dd>{organ.bloodSupply}</dd></div>
            </dl>
            <button className="lesson-button" onClick={onClose}>Continuar explorando <ArrowRight size={16} /></button>
          </>
        ) : (
          <>
            <p>Sigue las estructuras resaltadas, gira la muestra y relaciona su forma con su función. Esta experiencia breve está diseñada para consolidar tu aprendizaje.</p>
            <div className={`modal-demo ${type === "animation" ? "moving" : ""}`}><OrganArt organ={organ} asset="organ" alt={`Ilustración de ${organName}`} /></div>
            <button className="lesson-button" onClick={onClose}>Continuar explorando <ArrowRight size={16} /></button>
          </>
        )}
      </section>
    </div>
  );
}
