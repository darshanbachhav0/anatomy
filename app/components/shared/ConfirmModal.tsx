"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmModal({ title, description, confirmLabel, destructive = true, onConfirm, onClose }: { title: string; description: string; confirmLabel: string; destructive?: boolean; onConfirm: () => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => event.stopPropagation()}>
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Cerrar"><X size={17} /></button>
        <span><AlertTriangle size={23} /></span>
        <h2 id="confirm-title">{title}</h2>
        <p>{description}</p>
        <div><button type="button" className="secondary-action" onClick={onClose}>Cancelar</button><button type="button" className={destructive ? "danger-action" : "primary-action"} onClick={onConfirm}>{confirmLabel}</button></div>
      </section>
    </div>
  );
}
