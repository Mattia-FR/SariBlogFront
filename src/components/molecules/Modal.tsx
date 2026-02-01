import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () => {
      const root = dialogRef.current;
      if (!root) return [];

      const nodes = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      return Array.from(nodes).filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          el.getAttribute("aria-hidden") !== "true" &&
          (el.offsetWidth > 0 ||
            el.offsetHeight > 0 ||
            el === document.activeElement),
      );
    };

    const focusFirst = () => {
      const [first] = getFocusable();
      if (first) {
        first.focus();
      } else {
        dialogRef.current?.focus();
      }
    };

    // Focus initial à l'ouverture
    // queueMicrotask gère le timing du focus
    queueMicrotask(focusFirst);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();

      // Rien à focus -> on garde le focus sur le container
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      // Si le focus est sorti du dialog (rare mais possible), on le recadre
      if (!active || !dialogRef.current?.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey) {
        if (active === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);

      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    // biome-ignore lint/a11y/noStaticElementInteractions: overlay click-to-close is intentional UX pattern
    <div role="presentation" onClick={onClose} className="modal-overlay">
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: same */}
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        tabIndex={-1}
        className="modal-dialog"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la modale"
          className="modal-close"
        >
          ×
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
}
