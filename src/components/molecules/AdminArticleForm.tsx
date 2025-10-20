import { useId, useState } from "react";
import { useAdminUpload } from "../../hooks/useAdminUpload";
import type { AdminArticleFormProps } from "../../types/admin";

import "./AdminArticleForm.css";

function AdminArticleForm({
  formData,
  setFormData,
  tags,
  onSubmit,
  onCancel,
  isEditing = false,
}: AdminArticleFormProps) {
  const titleId = useId();
  const excerptId = useId();
  const contentId = useId();
  const imageId = useId();
  const statusId = useId();

  const [isUploading, setIsUploading] = useState(false);
  const { uploadSingle } = useAdminUpload();

  // ✅ Fonction pour générer automatiquement l'extrait
  const generateExcerptFromContent = () => {
    if (!formData.content) return;

    const cleanContent = formData.content.replace(/<[^>]*>/g, "");
    const maxLength = 150;

    if (cleanContent.length <= maxLength) {
      setFormData((prev) => ({ ...prev, excerpt: cleanContent }));
      return;
    }

    const truncated = cleanContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    const excerpt =
      lastSpace > 0
        ? `${truncated.substring(0, lastSpace)}...`
        : `${truncated}...`;

    setFormData((prev) => ({ ...prev, excerpt }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormData((prev) => ({ ...prev, image: response.data.file.filename }));
    } catch (error) {
      console.error("Erreur upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="admin-article-form">
      <fieldset className="form-group">
        <label htmlFor={titleId}>Titre *</label>
        <input
          type="text"
          id={titleId}
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          placeholder="Titre de l'article"
        />
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={excerptId}>Extrait</label>
        <textarea
          id={excerptId}
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          placeholder="Résumé de l'article"
          rows={3}
        />
        <button
          type="button"
          onClick={generateExcerptFromContent}
          className="generate-excerpt-btn"
          disabled={!formData.content}
          title={
            !formData.content
              ? "Ajoutez du contenu pour générer l'extrait"
              : "Générer automatiquement l'extrait à partir du contenu"
          }
        >
          Générer automatiquement
        </button>
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={contentId}>Contenu *</label>
        <textarea
          id={contentId}
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          placeholder="Contenu de l'article"
          rows={10}
        />
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
        {isUploading && <p>Upload en cours...</p>}
        {formData.image && (
          <p className="uploaded-file">Image sélectionnée: {formData.image}</p>
        )}
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={statusId}>Statut</label>
        <select
          id={statusId}
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
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
          {isEditing ? "Modifier l'article" : "Créer l'article"}
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

export default AdminArticleForm;
