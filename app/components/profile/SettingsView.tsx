"use client";

import { useState } from "react";
import { RotateCcw, Settings, Sparkles, Trash2 } from "lucide-react";
import type { UmaSettings } from "../../lib/storage";
import { ConfirmModal } from "../shared/ConfirmModal";

export function SettingsView({ settings, onUpdate, onResetLearning, onClearAll, onNotify }: { settings: UmaSettings; onUpdate: (change: Partial<UmaSettings>) => void; onResetLearning: () => void; onClearAll: () => void; onNotify: (message: string) => void }) {
  const [confirm, setConfirm] = useState<"learning" | "all" | null>(null);
  const options: Array<{ key: keyof UmaSettings; label: string; description: string }> = [
    { key: "autoRotate", label: "Animación automática del modelo", description: "Mantiene el órgano en rotación cuando no estás interactuando." },
    { key: "showViewerTips", label: "Mostrar consejos del visor", description: "Muestra la tarjeta de ayuda dentro del modelo 3D." },
    { key: "confirmNoteDelete", label: "Confirmar antes de eliminar apuntes", description: "Solicita confirmación antes de borrar un apunte." },
  ];
  return (
    <section className="content-view settings-view" aria-labelledby="settings-title">
      <header className="content-hero"><span className="content-kicker"><Settings size={15} /> Preferencias locales</span><h1 id="settings-title">Configuración</h1><p>Ajusta el comportamiento del simulador y la protección de tus datos guardados.</p></header>
      <div className="settings-list">{options.map((option) => <article key={option.key}><div><h2>{option.label}</h2><p>{option.description}</p></div><button type="button" role="switch" className={`toggle-control ${settings[option.key] ? "on" : ""}`} onClick={() => onUpdate({ [option.key]: !settings[option.key] })} aria-checked={settings[option.key]}><span /><b>{settings[option.key] ? "Activado" : "Desactivado"}</b></button></article>)}</div>
      <div className="danger-zone"><span><Sparkles size={15} /> Gestión de datos</span><article><div><h2>Restablecer progreso de aprendizaje</h2><p>Elimina estados de lecciones y resultados de cuestionarios. Conserva apuntes y favoritos.</p></div><button type="button" className="secondary-action" onClick={() => setConfirm("learning")}><RotateCcw size={15} /> Restablecer</button></article><article><div><h2>Borrar datos locales</h2><p>Elimina progreso, favoritos, historial, ajustes y apuntes guardados en este dispositivo.</p></div><button type="button" className="danger-action" onClick={() => setConfirm("all")}><Trash2 size={15} /> Borrar datos</button></article></div>
      {confirm === "learning" && <ConfirmModal title="Restablecer progreso" description="Se eliminarán el avance de las lecciones y las puntuaciones de los cuestionarios." confirmLabel="Restablecer" onConfirm={() => { onResetLearning(); setConfirm(null); onNotify("Progreso restablecido"); }} onClose={() => setConfirm(null)} />}
      {confirm === "all" && <ConfirmModal title="Borrar todos los datos locales" description="Esta acción eliminará tus apuntes, favoritos, progreso, historial y configuración en este dispositivo." confirmLabel="Borrar todo" onConfirm={() => { onClearAll(); setConfirm(null); onNotify("Datos locales eliminados"); }} onClose={() => setConfirm(null)} />}
    </section>
  );
}
