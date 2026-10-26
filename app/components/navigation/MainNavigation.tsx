import { Activity, BookOpen, Compass, HeartPulse, LibraryBig, Scan, Smile } from "lucide-react";

export type MainView =
  | "explore"
  | "dental"
  | "exploration"
  | "movements"
  | "echo"
  | "lessons"
  | "library"
  | "progress"
  | "favorites"
  | "settings"
  | "about";

const ITEMS = [
  { id: "explore", label: "Explorar", icon: Compass },
  { id: "dental", label: "Odontología", icon: Smile },
  { id: "exploration", label: "Exploración", icon: Scan },
  { id: "movements", label: "Movimientos", icon: Activity },
  { id: "echo", label: "Ecocardiografía", icon: HeartPulse },
  { id: "lessons", label: "Lecciones", icon: BookOpen },
  { id: "library", label: "Biblioteca", icon: LibraryBig },
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
          aria-label={label}
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
          aria-label={label}
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={18} /><span>{id === "dental" ? "Dental" : label}</span>
        </button>
      ))}
    </nav>
  );
}
