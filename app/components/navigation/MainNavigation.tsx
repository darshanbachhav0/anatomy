import { BookOpen, BrainCircuit, Compass, LibraryBig, NotebookPen } from "lucide-react";

export type MainView =
  | "explore"
  | "systems"
  | "lessons"
  | "library"
  | "notes"
  | "progress"
  | "favorites"
  | "settings"
  | "about";

const ITEMS = [
  { id: "explore", label: "Explorar", icon: Compass },
  { id: "systems", label: "Sistemas", icon: BrainCircuit },
  { id: "lessons", label: "Lecciones", icon: BookOpen },
  { id: "library", label: "Biblioteca", icon: LibraryBig },
  { id: "notes", label: "Apuntes", icon: NotebookPen },
] as const;

export function MainNavigation({ active, onNavigate }: { active: MainView; onNavigate: (view: MainView) => void }) {
  return (
    <nav className="main-nav" aria-label="Navegación principal">
      {ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          type="button"
          key={id}
          className={active === id ? "active" : ""}
          onClick={() => onNavigate(id)}
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={17} /> <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function MobileNavigation({ active, onNavigate }: { active: MainView; onNavigate: (view: MainView) => void }) {
  return (
    <nav className="mobile-nav" aria-label="Navegación móvil">
      {ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          type="button"
          key={id}
          className={active === id ? "active" : ""}
          onClick={() => onNavigate(id)}
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={18} /><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
