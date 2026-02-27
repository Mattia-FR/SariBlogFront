import { type FormEvent, useCallback, useEffect, useId, useState } from "react";
import { toast } from "react-toastify";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";

function TagsAdmin() {
  const id = useId();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      const data = await api.get<Tag[]>("/admin/tags");
      setTags(data);
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
    fetchTags();
  }, [fetchTags]);

  if (loading) return <p>Chargement des tags…</p>;
  if (error) return <p>{error}</p>;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      toast.error("Le nom est requis");
      return;
    }

    try {
      await api.post<Tag>("/admin/tags", { name });
      toast.success("Tag créé avec succès");
      event.currentTarget.reset();
      await fetchTags();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du tag");
    }
  }

  async function handleUpdate(
    tagId: number,
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      toast.error("Le nom est requis");
      return;
    }

    try {
      await api.patch<Tag>(`/admin/tags/${tagId}`, { name });
      toast.success("Tag modifié");
      setEditingId(null);
      await fetchTags();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la modification du tag");
    }
  }

  async function handleDelete(tagId: number) {
    try {
      await api.delete(`/admin/tags/${tagId}`);
      toast.success("Tag supprimé");
      await fetchTags();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression du tag");
    }
  }

  return (
    <main>
      <h2>Gestion des tags</h2>

      <section className="tags-form">
        <h3>Nouveau tag</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor={`${id}-name`}>Nom</label>
            <input
              id={`${id}-name`}
              type="text"
              name="name"
              placeholder="Nom du tag"
              required
            />
          </div>
          <button type="submit">Créer le tag</button>
        </form>
      </section>

      <section className="tags-list">
        <ul>
          {tags.map((tag) => (
            <li key={tag.id}>
              {editingId === tag.id ? (
                <form
                  onSubmit={(e) => handleUpdate(tag.id, e)}
                  className="tag-edit-form"
                >
                  <div>
                    <label htmlFor={`${id}-edit-${tag.id}-name`}>Nom</label>
                    <input
                      id={`${id}-edit-${tag.id}-name`}
                      type="text"
                      name="name"
                      defaultValue={tag.name}
                      required
                    />
                  </div>
                  <button type="submit">Enregistrer</button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Annuler la modification"
                  >
                    Annuler
                  </button>
                </form>
              ) : (
                <>
                  <span>
                    {tag.name} ({tag.slug})
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingId(tag.id)}
                    aria-label={`Modifier le tag ${tag.name}`}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tag.id)}
                    aria-label={`Supprimer le tag ${tag.name}`}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default TagsAdmin;
