import { useId } from "react";
import type { CreateUserData } from "../../types/admin";

type AdminUserFormProps = {
  formData: CreateUserData;
  setFormData: React.Dispatch<React.SetStateAction<CreateUserData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
};

function AdminUserForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing = false,
}: AdminUserFormProps) {
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const roleId = useId();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="admin-user-form">
      <fieldset className="form-group">
        <label htmlFor={usernameId}>Nom d'utilisateur *</label>
        <input
          type="text"
          id={usernameId}
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          placeholder="Nom d'utilisateur"
          maxLength={50}
        />
        <p className="form-help">
          Le nom d'utilisateur doit être unique et contenir entre 3 et 50
          caractères.
        </p>
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={emailId}>Email *</label>
        <input
          type="email"
          id={emailId}
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="utilisateur@example.com"
        />
        <p className="form-help">
          L'adresse email sera utilisée pour la connexion et les notifications.
        </p>
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={passwordId}>
          Mot de passe {isEditing ? "(optionnel)" : "*"}
        </label>
        <input
          type="password"
          id={passwordId}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required={!isEditing}
          placeholder={
            isEditing ? "Laisser vide pour ne pas changer" : "Mot de passe"
          }
          minLength={8}
        />
        <p className="form-help">
          {isEditing
            ? "Laisser vide pour conserver le mot de passe actuel."
            : "Le mot de passe doit contenir au moins 8 caractères."}
        </p>
      </fieldset>

      <fieldset className="form-group">
        <label htmlFor={roleId}>Rôle *</label>
        <select
          id={roleId}
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
        >
          <option value="editor">Éditeur</option>
          <option value="admin">Administrateur</option>
        </select>
        <p className="form-help">
          Les administrateurs ont accès à toutes les fonctionnalités, les
          éditeurs peuvent gérer le contenu.
        </p>
      </fieldset>

      <nav className="form-actions">
        <button type="submit" className="admin-button primary">
          {isEditing ? "Modifier l'utilisateur" : "Créer l'utilisateur"}
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

export default AdminUserForm;
