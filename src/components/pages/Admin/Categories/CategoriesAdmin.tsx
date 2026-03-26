import { type FormEvent, useCallback, useEffect, useId, useState } from "react";
import { toast } from "react-toastify";
import type {
  Category,
  CategoryUpdateData,
} from "../../../../types/categories";
import { api } from "../../../../utils/apiClient";
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
      const message =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) return <p>Chargement des catégories…</p>;
  if (error) return <p>{error}</p>;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
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
      event.currentTarget.reset();
      await fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de la catégorie");
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
      console.error(err);
      toast.error("Erreur lors de la modification de la catégorie");
    }
  }

  async function handleDelete(categoryId: number) {
    try {
      await api.delete(`/admin/categories/${categoryId}`);
      toast.success("Catégorie supprimée");
      await fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression de la catégorie");
    }
  }

  return (
    <section className="categories">
      <h2 className="categories-title">Gestion des catégories</h2>

      <section className="categories-form">
        <h3>Nouvelle catégorie</h3>
        <form onSubmit={handleSubmit}>
          <div className="categories-form-field">
            <label htmlFor={`${id}-name`}>Nom :</label>
            <input
              id={`${id}-name`}
              type="text"
              name="name"
              placeholder="Nom de la catégorie"
              required
            />
          </div>
          <div className="categories-form-field">
            <label htmlFor={`${id}-display_order`}>
              Ordre d&apos;affichage :
            </label>
            <input
              id={`${id}-display_order`}
              type="number"
              name="display_order"
              min={0}
              step={1}
              placeholder="Dernière position par défaut"
            />
          </div>
          <button type="submit" className="categories-form-button">
            Créer la catégorie
          </button>
        </form>
      </section>

      <section className="categories-list">
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {editingId === category.id ? (
                <form
                  onSubmit={(e) => handleUpdate(category.id, e)}
                  className="category-edit-form"
                >
                  <div className="categories-form-field">
                    <label htmlFor={`${id}-edit-${category.id}-name`}>
                      Nom :
                    </label>
                    <input
                      id={`${id}-edit-${category.id}-name`}
                      type="text"
                      name="name"
                      defaultValue={category.name}
                      required
                    />
                  </div>
                  <div className="categories-form-field">
                    <label htmlFor={`${id}-edit-${category.id}-order`}>
                      Ordre d&apos;affichage :
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
                  <div className="categories-list-buttons">
                    <button type="submit">Enregistrer</button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      aria-label="Annuler la modification"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="categories-list-list">
                  <div>
                    {category.name} — position {category.display_order}
                  </div>
                  <div className="categories-list-buttons">
                    <button
                      type="button"
                      onClick={() => setEditingId(category.id)}
                      aria-label={`Modifier la catégorie ${category.name}`}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
                      aria-label={`Supprimer la catégorie ${category.name}`}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default CategoriesAdmin;
