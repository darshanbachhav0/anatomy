"use client";

import { useEffect, useRef } from "react";
import { BookHeart, ChevronDown, CircleUserRound, Info, NotebookPen, Settings, TrendingUp } from "lucide-react";
import type { MainView } from "./MainNavigation";

const ITEMS: Array<{ view: MainView; label: string; icon: typeof TrendingUp }> = [
  { view: "progress", label: "Mi progreso", icon: TrendingUp },
  { view: "favorites", label: "Mis favoritos", icon: BookHeart },
  { view: "notes", label: "Mis apuntes", icon: NotebookPen },
  { view: "settings", label: "Configuración", icon: Settings },
  { view: "about", label: "Acerca del simulador", icon: Info },
];

export function ProfileMenu({ open, onOpenChange, onNavigate }: { open: boolean; onOpenChange: (open: boolean) => void; onNavigate: (view: MainView) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent | PointerEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") onOpenChange(false);
      if (event instanceof PointerEvent && rootRef.current && !rootRef.current.contains(event.target as Node)) onOpenChange(false);
    };
    window.addEventListener("keydown", close);
    window.addEventListener("pointerdown", close);
    return () => { window.removeEventListener("keydown", close); window.removeEventListener("pointerdown", close); };
  }, [open, onOpenChange]);

  return (
    <div className="profile-menu" ref={rootRef}>
      <button className="profile" type="button" onClick={() => onOpenChange(!open)} aria-label="Abrir menú del perfil" aria-expanded={open}><span>UMA</span><ChevronDown size={15} /></button>
      {open && <div className="profile-dropdown" role="menu">
        <header><CircleUserRound size={27} /><div><b>Estudiante UMA</b><span>Universidad María Auxiliadora</span></div></header>
        <div>{ITEMS.map(({ view, label, icon: Icon }, index) => <button type="button" role="menuitem" key={view} className={index === 3 ? "menu-divider" : ""} onClick={() => { onNavigate(view); onOpenChange(false); }}><Icon size={16} />{label}</button>)}</div>
      </div>}
    </div>
  );
}
