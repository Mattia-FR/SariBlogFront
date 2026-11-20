import { useEffect, useRef } from "react";
import "./Modal.css";
import type { ModalProps } from "../../types/modal";

function isPointerOutside(
  event: PointerEvent,
  dialog: HTMLDialogElement,
): boolean {
  const rect = dialog.getBoundingClientRect();
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  );
}

export default function Modal({
  isOpen,
  onClose,
  ariaLabel,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onCloseRef.current();
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    let pressedOutside = false;

    const handlePointerDown = (event: PointerEvent) => {
      pressedOutside = isPointerOutside(event, dialog);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (pressedOutside && isPointerOutside(event, dialog)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener("pointerdown", handlePointerDown);
    dialog.addEventListener("pointerup", handlePointerUp);
    return () => {
      dialog.removeEventListener("pointerdown", handlePointerDown);
      dialog.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-label={ariaLabel}
      {...({ closedby: "any" } as Record<string, string>)}
    >
      {children}
      <button
        type="button"
        className="modal-close"
        aria-label="Fermer"
        onClick={() => dialogRef.current?.close()}
      >
        ×
      </button>
    </dialog>
  );
}
