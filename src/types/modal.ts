import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface ModalContentProps {
  title?: string;
  content: ReactNode;
  actions?: ReactNode;
}
