import {
  createContext,
  type ReactNode,
  isValidElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import Modal from "../components/molecules/Modal";
import type { ModalContentProps } from "../types/modal";

export interface ModalContextValue {
  openModal: (content: ReactNode | ModalContentProps) => void;
  closeModal: () => void;
  isOpen: boolean;
}

export const ModalContext = createContext<ModalContextValue | undefined>(
  undefined,
);

interface ModalProviderProps {
  children: ReactNode;
}

type ModalContent =
  | { kind: "node"; node: ReactNode }
  | ({ kind: "structured" } & ModalContentProps);

function isStructuredModalContent(value: unknown): value is ModalContentProps {
  return (
    !!value &&
    typeof value === "object" &&
    !isValidElement(value) &&
    "content" in value
  );
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const openModal = useCallback((content: ReactNode | ModalContentProps) => {
    if (isStructuredModalContent(content)) {
      setModalContent({ kind: "structured", ...content });
    } else {
      setModalContent({ kind: "node", node: content });
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({ openModal, closeModal, isOpen }),
    [openModal, closeModal, isOpen],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalContent?.kind === "structured" ? (
          <div>
            {modalContent.title ? (
              <h2>{modalContent.title}</h2>
            ) : null}
            <div>{modalContent.content}</div>
            {modalContent.actions ? (
              <div>{modalContent.actions}</div>
            ) : null}
          </div>
        ) : (
          modalContent?.node ?? null
        )}
      </Modal>
    </ModalContext.Provider>
  );
}

