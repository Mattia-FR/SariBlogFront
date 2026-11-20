import { type FormEvent, useCallback, useEffect, useId, useState } from "react";
import { toast } from "react-toastify";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import { isAbortError } from "../../../../utils/apiError";
import { notifyError } from "../../../../utils/notifyError";
import "./TagsAdmin.css";

function TagsAdmin() {
  const id = useId();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTags = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await api.get<Tag[]>(
        "/admin/tags",
        signal ? { signal } : undefined,
      );
      setTags(data);
    } catch (err) {
      if (isAbortError(err)) return;
      setError(notifyError(err, "Erreur lors du chargement"));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    void fetchTags(ac.signal);
    return () => ac.abort();
  }, [fetchTags]);

  if (loading) {
    return (
      <section className="tags">
        <p className="tags-status">Chargement des tags…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tags">
        <p className="tags-status tags-status--error">{error}</p>
      </section>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // `currentTarget` vaut null après un await : on garde une référence au formulaire
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      toast.error("Le nom est requis");
      return;
    }

    try {
      await api.post<Tag>("/admin/tags", { name });
      toast.success("Tag créé avec succès");
      form.reset();
      await fetchTags();
    } catch (err) {
      notifyError(err, "Erreur lors de la création du tag");
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
      notifyError(err, "Erreur lors de la modification du tag");
    }
  }

  async function handleDelete(tagId: number) {
    try {
      await api.delete(`/admin/tags/${tagId}`);
      toast.success("Tag supprimé");
      await fetchTags();
    } catch (err) {
      notifyError(err, "Erreur lors de la suppression du tag");
    }
  }

  return (
    <section className="tags">
      <h2 className="tags-title">Gestion des tags</h2>

      <section className="tags-form">
        <h3>Nouveau tag</h3>
        <form onSubmit={handleSubmit}>
          <div className="tags-form-field">
            <label htmlFor={`${id}-name`}>Nom</label>
            <input
              id={`${id}-name`}
              type="text"
              name="name"
              placeholder="Nom du tag"
              required
            />
          </div>
          <button type="submit" className="tags-btn tags-btn--primary">
            Créer le tag
          </button>
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
                  <div className="tags-form-field">
                    <label htmlFor={`${id}-edit-${tag.id}-name`}>Nom</label>
                    <input
                      id={`${id}-edit-${tag.id}-name`}
                      type="text"
                      name="name"
                      defaultValue={tag.name}
                      required
                    />
                  </div>
                  <div className="tags-list-buttons">
                    <button type="submit" className="tags-btn tags-btn--primary">
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      className="tags-btn tags-btn--ghost"
                      onClick={() => setEditingId(null)}
                      aria-label="Annuler la modification"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="tags-list-item">
                  <div className="tags-list-meta">
                    <span className="tags-list-name">{tag.name}</span>
                    <span className="tags-list-slug">{tag.slug}</span>
                  </div>
                  <div className="tags-list-buttons">
                    <button
                      type="button"
                      className="tags-btn tags-btn--ghost"
                      onClick={() => setEditingId(tag.id)}
                      aria-label={`Modifier le tag ${tag.name}`}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="tags-btn tags-btn--danger"
                      onClick={() => handleDelete(tag.id)}
                      aria-label={`Supprimer le tag ${tag.name}`}
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

export default TagsAdmin;
