"use client";
/* eslint-disable @next/next/no-img-element -- The local UMA logo is served as an already optimized static asset. */

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  Bookmark,
  Heart,
  LibraryBig,
  Search,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { OrganViewer } from "./OrganViewer";
import { organById, organs, type OrganId } from "../lib/anatomy-data";
import { useUmaStudentData } from "../hooks/useUmaStudentData";
import { MainNavigation, MobileNavigation, type MainView } from "./navigation/MainNavigation";
import { OrganArt } from "./shared/OrganArt";
import { Toast } from "./shared/Toast";
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

const FullBodyAtlas = lazy(() => import("./atlas/FullBodyAtlas"));
const DentalView = lazy(() => import("./dental/DentalView"));
const StudyAtlasView = lazy(() => import("./study-atlas/StudyAtlasView"));

export function AnatomyApp() {
  const student = useUmaStudentData();
  const { data } = student;
  const [activeView, setActiveView] = useState<MainView>("explore");
  const [organId, setOrganId] = useState<OrganId>("heart");
  const [query, setQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState("all");
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sheetOrganId, setSheetOrganId] = useState<OrganId | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());
  const organ = organById[organId];
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
  };

  const toggleFavorite = (id: OrganId) => {
    const removing = data.favorites.includes(id);
    student.toggleFavorite(id);
    setToast(removing ? "Eliminado de favoritos" : "Agregado a favoritos");
  };

  const viewLabels: Record<MainView, string> = {
    explore: "Explorar",
    atlas: "Atlas 3D",
    dental: "Odontología",
    exploration: "Exploración",
    movements: "Movimientos",
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

        <OrganViewer organ={organ} autoRotate={data.settings.autoRotate} />

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
        </aside>
      </div>
      </> : activeView === "atlas" ? (
        <Suspense fallback={<section className="content-view" role="status">Cargando el laboratorio anatómico…</section>}>
          <FullBodyAtlas initialScope="body" onBack={() => setActiveView("explore")} onViewOrgan={selectOrgan} />
        </Suspense>
      ) : activeView === "dental" ? (
        <Suspense fallback={<section className="content-view" role="status">Cargando el laboratorio de odontología…</section>}>
          <DentalView />
        </Suspense>
      ) : activeView === "exploration" || activeView === "movements" ? (
        <Suspense fallback={<section className="content-view" role="status">Cargando el simulador anatómico…</section>}>
          <StudyAtlasView key={activeView} mode={activeView === "movements" ? "motion" : "explore"} />
        </Suspense>
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
