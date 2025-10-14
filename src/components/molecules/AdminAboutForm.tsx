import { useId, useState } from "react";
import type { AdminAboutFormProps, UpdateAboutData } from "../../types/admin";

function AdminAboutForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  onImageUpload,
}: AdminAboutFormProps) {
  const contentId = useId();
  const imageId = useId();

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onImageUpload(file);
    } catch (error) {
      console.error("Erreur upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="admin-about-form">
      <fieldset className="form-group">
        <label htmlFor={contentId}>Contenu *</label>
        <textarea
          id={contentId}
          name="content"
          value={formData.content || ""}
          onChange={handleInputChange}
          required
          placeholder="Contenu de la page 'À propos'..."
          rows={15}
        />
        <p className="form-help">
          Vous pouvez utiliser du HTML pour formater le contenu. Le contenu sera
          affiché sur la page "À propos" du site.
        </p>
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={imageId}>Image</label>
        <input
          type="file"
          id={imageId}
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading && <p className="upload-status">Upload en cours...</p>}
        {formData.image && (
          <p className="uploaded-file">Image sélectionnée: {formData.image}</p>
        )}
        <p className="form-help">
          L'image sera affichée en haut de la page "À propos". Formats acceptés
          : JPG, PNG, GIF. Taille recommandée : 800x600px.
        </p>
      </fieldset>

      <nav className="form-actions">
        <button type="submit" className="admin-button primary">
          Mettre à jour le contenu
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="admin-button secondary"
        >
          Annuler
        </button>
      </nav>
    </form>
  );
}

export default AdminAboutForm;
