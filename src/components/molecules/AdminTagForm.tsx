import { useId } from "react";
import type { AdminTagFormProps } from "../../types/admin";

import "./AdminTagForm.css";

function AdminTagForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing = false,
}: AdminTagFormProps) {
  const nameId = useId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="admin-tag-form">
      <fieldset className="form-group">
        <label htmlFor={nameId}>Nom du tag *</label>
        <input
          type="text"
          id={nameId}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Nom du tag"
          maxLength={50}
        />
        <p className="form-help">
          Le nom du tag sera utilisé pour catégoriser les articles et
          illustrations.
        </p>
      </fieldset>

      <section className="form-actions">
        <button type="submit" className="admin-button primary">
          {isEditing ? "Modifier le tag" : "Créer le tag"}
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

export default AdminTagForm;
