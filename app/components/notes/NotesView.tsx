"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, Heart, NotebookPen, Plus, Search, Star, Trash2 } from "lucide-react";
import { organById, organs, type OrganId } from "../../lib/anatomy-data";
import type { StudentNote } from "../../lib/storage";
import { ConfirmModal } from "../shared/ConfirmModal";
import { matchesSearch } from "../../lib/search";

export function NotesView({
  notes,
  selectedOrganId,
  confirmDelete,
  onSave,
  onDelete,
  onViewOrgan,
  onNotify,
}: {
  notes: StudentNote[];
  selectedOrganId: OrganId;
  confirmDelete: boolean;
  onSave: (note: StudentNote) => void;
  onDelete: (noteId: string) => void;
  onViewOrgan: (organId: OrganId) => void;
  onNotify: (message: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [organFilter, setOrganFilter] = useState<"all" | OrganId>("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [pendingDelete, setPendingDelete] = useState<StudentNote | null>(null);
  const selected = notes.find((note) => note.id === selectedId) ?? null;
  const allTags = [...new Set(notes.flatMap((note) => note.tags))].sort();

  useEffect(() => {
    if (selectedId || !notes[0]) return;
    const frame = window.requestAnimationFrame(() => setSelectedId(notes[0].id));
    return () => window.cancelAnimationFrame(frame);
  }, [notes, selectedId]);

  const visibleNotes = useMemo(() => notes.filter((note) => {
    const matchesQuery = matchesSearch(query, note.title, note.content, note.tags.join(" "), organById[note.organId].name);
    return matchesQuery && (organFilter === "all" || note.organId === organFilter) && (tagFilter === "all" || note.tags.includes(tagFilter));
  }).sort((a, b) => sort === "newest" ? b.updatedAt.localeCompare(a.updatedAt) : a.updatedAt.localeCompare(b.updatedAt)), [notes, query, organFilter, tagFilter, sort]);

  const createNote = () => {
    const now = new Date().toISOString();
    const note: StudentNote = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `note-${Date.now()}`,
      title: "Nuevo apunte",
      content: "",
      organId: selectedOrganId,
      tags: [],
      important: false,
      createdAt: now,
      updatedAt: now,
    };
    onSave(note);
    setSelectedId(note.id);
    onNotify("Apunte creado");
  };

  const updateSelected = (change: Partial<StudentNote>) => {
    if (!selected) return;
    onSave({ ...selected, ...change, updatedAt: new Date().toISOString() });
  };

  const requestDelete = (note: StudentNote) => {
    if (confirmDelete) setPendingDelete(note);
    else performDelete(note);
  };

  const performDelete = (note: StudentNote) => {
    onDelete(note.id);
    setSelectedId(null);
    setPendingDelete(null);
    onNotify("Apunte eliminado");
  };

  const counts = organs.map((organ) => ({ organ, count: notes.filter((note) => note.organId === organ.id).length })).filter((item) => item.count > 0);

  return (
    <section className="content-view notes-view" aria-labelledby="notes-title">
      <header className="content-hero content-hero-row">
        <div><span className="content-kicker"><NotebookPen size={15} /> Espacio personal</span><h1 id="notes-title">Mis apuntes</h1><p>Organiza ideas, conceptos clave y repasos vinculados con cada modelo anatómico.</p></div>
        <button type="button" className="primary-action" onClick={createNote}><Plus size={16} /> Nuevo apunte</button>
      </header>

      {counts.length > 0 && <div className="note-groups">{counts.map(({ organ, count }) => <button type="button" key={organ.id} onClick={() => setOrganFilter(organ.id)}><b>{organ.name}</b><span>{count} {count === 1 ? "apunte" : "apuntes"}</span></button>)}</div>}

      {notes.length === 0 ? <div className="empty-state"><span><NotebookPen size={24} /></span><h2>Aún no tienes apuntes.</h2><p>Crea tu primer apunte y relaciónalo con un órgano.</p><button type="button" className="primary-action" onClick={createNote}>Crear primer apunte</button></div> : (
        <div className="notes-layout">
          <aside className="notes-sidebar">
            <label className="notes-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar apuntes..." aria-label="Buscar apuntes" /></label>
            <div className="notes-filters">
              <select value={organFilter} onChange={(event) => setOrganFilter(event.target.value as "all" | OrganId)} aria-label="Filtrar apuntes por órgano"><option value="all">Todos los órganos</option>{organs.map((organ) => <option key={organ.id} value={organ.id}>{organ.name}</option>)}</select>
              <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} aria-label="Filtrar apuntes por etiqueta"><option value="all">Todas las etiquetas</option>{allTags.map((tag) => <option key={tag} value={tag}>#{tag}</option>)}</select>
              <select value={sort} onChange={(event) => setSort(event.target.value as "newest" | "oldest")} aria-label="Ordenar apuntes"><option value="newest">Más recientes</option><option value="oldest">Más antiguos</option></select>
            </div>
            <div className="notes-list">{visibleNotes.map((note) => <button type="button" key={note.id} className={selectedId === note.id ? "active" : ""} onClick={() => setSelectedId(note.id)}><span>{note.important && <Star size={12} fill="currentColor" />}{organById[note.organId].name}</span><b>{note.title || "Sin título"}</b><small>{new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(note.updatedAt))}</small></button>)}</div>
          </aside>
          {selected ? <article className="note-editor">
            <div className="editor-status"><span>Guardado automáticamente ✓</span><button type="button" className={selected.important ? "active" : ""} onClick={() => updateSelected({ important: !selected.important })} aria-label={selected.important ? "Quitar marca de importante" : "Marcar como importante"}><Star size={16} fill={selected.important ? "currentColor" : "none"} /></button><button type="button" onClick={() => requestDelete(selected)} aria-label="Eliminar apunte"><Trash2 size={16} /></button></div>
            <label>Título<input value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} /></label>
            <label>Órgano<select value={selected.organId} onChange={(event) => updateSelected({ organId: event.target.value as OrganId })}>{organs.map((organ) => <option key={organ.id} value={organ.id}>{organ.name}</option>)}</select></label>
            <label>Apunte<textarea value={selected.content} onChange={(event) => updateSelected({ content: event.target.value })} placeholder="Escribe aquí tus observaciones..." /></label>
            <label>Etiquetas<input value={selected.tags.join(", ")} onChange={(event) => updateSelected({ tags: event.target.value.split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean) })} placeholder="examen, anatomía, repaso" /></label>
            <footer><span><Calendar size={13} /> Actualizado {new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(selected.updatedAt))}</span><button type="button" className="secondary-action" onClick={() => onViewOrgan(selected.organId)}>Ver órgano en 3D <ArrowRight size={14} /></button></footer>
          </article> : <div className="empty-editor"><Heart size={24} /><p>Selecciona un apunte para editarlo.</p></div>}
        </div>
      )}
      {pendingDelete && <ConfirmModal title="Eliminar apunte" description={`Se eliminará “${pendingDelete.title}”. Esta acción no se puede deshacer.`} confirmLabel="Eliminar" onConfirm={() => performDelete(pendingDelete)} onClose={() => setPendingDelete(null)} />}
    </section>
  );
}
