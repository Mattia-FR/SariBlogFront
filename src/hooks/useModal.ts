import { useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";

export function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error(
      "useModal doit être utilisé dans un ModalProvider. " +
        "Enveloppez votre composant avec <ModalProvider>.",
    );
  }

  return context;
}

