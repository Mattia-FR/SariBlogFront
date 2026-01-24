import type { ReactNode } from "react";

export interface ModalContentProps {
  title?: string;
  content: ReactNode;
  actions?: ReactNode;
}

