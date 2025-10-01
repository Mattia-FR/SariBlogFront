import { useId, useState } from "react";
import { useAdminUpload } from "../../hooks/useAdminUpload";
import type { AdminTag, CreateIllustrationData } from "../../types/admin";

import "./AdminIllustrationForm.css";

type AdminIllustrationFormProps = {
  formData: CreateIllustrationData;
  setFormData: React.Dispatch<React.SetStateAction<CreateIllustrationData>>;
  tags: AdminTag[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
};

function AdminIllustrationForm({
  formData,
  setFormData,
  tags,
  onSubmit,
  onCancel,
  isEditing = false,
}: AdminIllustrationFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const imageId = useId();
  const altTextId = useId();
  const galleryId = useId();

  const [isUploading, setIsUploading] = useState(false);
  const { uploadSingle } = useAdminUpload();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTagChange = (tagId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: checked
        ? [...prev.tagIds, tagId]
        : prev.tagIds.filter((id) => id !== tagId),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadSingle(file);
      setFormData((prev) => ({ ...prev, image: response.file.filename }));
    } catch (error) {
      console.error("Erreur upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="admin-illustration-form">
      <fieldset className="form-group">
        <label htmlFor={titleId}>Titre *</label>
        <input
          type="text"
          id={titleId}
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          placeholder="Titre de l'illustration"
        />
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={descriptionId}>Description</label>
        <textarea
          id={descriptionId}
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description de l'illustration"
          rows={3}
        />
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={altTextId}>Texte alternatif *</label>
        <input
          type="text"
          id={altTextId}
          name="alt_text"
          value={formData.alt_text}
          onChange={handleInputChange}
          required
          placeholder="Description pour l'accessibilité"
        />
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={imageId}>Image *</label>
        <input
          type="file"
          id={imageId}
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading && <p>Upload en cours...</p>}
        {formData.image && (
          <p className="uploaded-file">Image sélectionnée: {formData.image}</p>
        )}
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={galleryId} className="checkbox-label">
          <input
            type="checkbox"
            id={galleryId}
            name="is_in_gallery"
            checked={formData.is_in_gallery}
            onChange={handleInputChange}
          />
          <span>Afficher dans la galerie</span>
        </label>
      </fieldset>

      <fieldset className="form-group">
        <legend>Tags</legend>
        <section className="tags-checkboxes">
          {tags.map((tag) => (
            <label key={tag.id} className="tag-checkbox">
              <input
                type="checkbox"
                checked={formData.tagIds.includes(tag.id)}
                onChange={(e) => handleTagChange(tag.id, e.target.checked)}
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </section>
      </fieldset>

      <section className="form-actions">
        <button type="submit" className="admin-button primary">
          {isEditing ? "Modifier l'illustration" : "Créer l'illustration"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="admin-button secondary"
        >
          Annuler
        </button>
      </section>
    </form>
  );
}

export default AdminIllustrationForm;
