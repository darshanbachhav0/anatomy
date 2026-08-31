import { CheckCircle2, X } from "lucide-react";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="app-toast" role="status" aria-live="polite">
      <CheckCircle2 size={17} />
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Cerrar notificación"><X size={14} /></button>
    </div>
  );
}
