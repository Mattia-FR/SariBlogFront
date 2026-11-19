import { type FormEvent, useCallback, useEffect, useId, useState } from "react";
import { toast } from "react-toastify";
import type {
  Category,
  CategoryUpdateData,
} from "../../../../types/categories";
import { api } from "../../../../utils/apiClient";
import { notifyError } from "../../../../utils/notifyError";
import "./CategoriesAdmin.css";

function CategoriesAdmin() {
  const id = useId();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get<Category[]>("/admin/categories");
      setCategories(data);
    } catch (err) {
      setError(notifyError(err, "Erreur lors du chargement"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <section className="categories-admin">
        <p className="categories-admin-status">Chargement des catégories…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="categories-admin">
        <p className="categories-admin-status categories-admin-status--error">
          {error}
        </p>
      </section>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // `currentTarget` vaut null après un await : on garde une référence au formulaire
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const display_orderRaw = formData.get("display_order");
    const display_order =
      display_orderRaw !== null && display_orderRaw !== ""
        ? Number(display_orderRaw)
        : undefined;

    if (!name) {
      toast.error("Le nom est requis");
      return;
    }

    try {
      await api.post<Category>("/admin/categories", {
        name,
        ...(display_order !== undefined &&
          Number.isInteger(display_order) && { display_order }),
      });
      toast.success("Catégorie créée avec succès");
      form.reset();
      await fetchCategories();
    } catch (err) {
      notifyError(err, "Erreur lors de la création de la catégorie");
    }
  }

  async function handleUpdate(
    categoryId: number,
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const display_orderRaw = formData.get("display_order");
    const display_order =
      display_orderRaw !== null && display_orderRaw !== ""
        ? Number(display_orderRaw)
        : undefined;

    const data: CategoryUpdateData = {};
    if (name) data.name = name;
    if (display_order !== undefined && Number.isInteger(display_order)) {
      data.display_order = display_order;
    }

    if (Object.keys(data).length === 0) {
      toast.error("Modifiez au moins un champ (nom ou ordre)");
      return;
    }

    try {
      await api.patch<Category>(`/admin/categories/${categoryId}`, data);
      toast.success("Catégorie modifiée");
      setEditingId(null);
      await fetchCategories();
    } catch (err) {
      notifyError(err, "Erreur lors de la modification de la catégorie");
    }
  }

  async function handleDelete(categoryId: number) {
    try {
      await api.delete(`/admin/categories/${categoryId}`);
      toast.success("Catégorie supprimée");
      await fetchCategories();
    } catch (err) {
      notifyError(err, "Erreur lors de la suppression de la catégorie");
    }
  }

  return (
    <section className="categories-admin">
      <header className="categories-admin-header">
        <p className="categories-admin-kicker">Administration</p>
        <h2 className="categories-admin-title">Gestion des catégories</h2>
      </header>

      <section className="categories-admin-form">
        <h3 className="categories-admin-form-title">Nouvelle catégorie</h3>
        <form onSubmit={handleSubmit}>
          <div className="categories-admin-field">
            <label htmlFor={`${id}-name`}>Nom</label>
            <input
              id={`${id}-name`}
              type="text"
              name="name"
              placeholder="Nom de la catégorie"
              required
            />
          </div>
          <div className="categories-admin-field">
            <label htmlFor={`${id}-display_order`}>Ordre d&apos;affichage</label>
            <input
              id={`${id}-display_order`}
              type="number"
              name="display_order"
              min={0}
              step={1}
              placeholder="Dernière position par défaut"
            />
          </div>
          <button
            type="submit"
            className="categories-admin-btn categories-admin-btn--primary"
          >
            Créer la catégorie
          </button>
        </form>
      </section>

      <section className="categories-admin-list">
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="categories-admin-item">
              {editingId === category.id ? (
                <form
                  onSubmit={(e) => handleUpdate(category.id, e)}
                  className="categories-admin-edit"
                >
                  <div className="categories-admin-field">
                    <label htmlFor={`${id}-edit-${category.id}-name`}>
                      Nom
                    </label>
                    <input
                      id={`${id}-edit-${category.id}-name`}
                      type="text"
                      name="name"
                      defaultValue={category.name}
                      required
                    />
                  </div>
                  <div className="categories-admin-field">
                    <label htmlFor={`${id}-edit-${category.id}-order`}>
                      Ordre d&apos;affichage
                    </label>
                    <input
                      id={`${id}-edit-${category.id}-order`}
                      type="number"
                      name="display_order"
                      defaultValue={category.display_order}
                      min={0}
                      step={1}
                    />
                  </div>
                  <div className="categories-admin-item-actions">
                    <button
                      type="submit"
                      className="categories-admin-btn categories-admin-btn--primary"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      className="categories-admin-btn"
                      onClick={() => setEditingId(null)}
                      aria-label="Annuler la modification"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="categories-admin-item-meta">
                    <span className="categories-admin-item-name">
                      {category.name}
                    </span>
                    <span className="categories-admin-item-slug">
                      {category.slug}
                    </span>
                    <span className="categories-admin-item-order">
                      Position {category.display_order}
                    </span>
                  </div>
                  <div className="categories-admin-item-actions">
                    <button
                      type="button"
                      className="categories-admin-btn"
                      onClick={() => setEditingId(category.id)}
                      aria-label={`Modifier la catégorie ${category.name}`}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="categories-admin-btn"
                      onClick={() => handleDelete(category.id)}
                      aria-label={`Supprimer la catégorie ${category.name}`}
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default CategoriesAdmin;
