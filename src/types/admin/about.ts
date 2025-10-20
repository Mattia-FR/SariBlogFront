// Types pour le contenu "À propos" admin
export type AdminAbout = {
  id: number;
  content: string;
  image: string | null;
  updated_at: string;
};

export type UpdateAboutData = {
  content?: string;
  image?: string;
};

export type AboutHistory = {
  id: number;
  content: string;
  image: string | null;
  updated_at: string;
  updated_by: string;
};

// Types pour les réponses API spécifiques à la page À propos
export type AdminAboutPageData = {
  about: AdminAbout | null;
  history: AboutHistory[];
};

// Types pour les composants admin de la page À propos
export type AdminAboutFormProps = {
  formData: UpdateAboutData;
  setFormData: React.Dispatch<React.SetStateAction<UpdateAboutData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onImageUpload: (file: File) => Promise<void>;
};
