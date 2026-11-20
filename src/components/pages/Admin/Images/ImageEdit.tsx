import { type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { Category } from "../../../../types/categories";
import type { Image } from "../../../../types/image";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import { isAbortError } from "../../../../utils/apiError";
import { notifyError } from "../../../../utils/notifyError";
import CategoryRadios from "../../../molecules/CategoryRadios";
import TagCheckboxes from "../../../molecules/TagCheckboxes";
import "./ImageAdminForm.css";

function ImageEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const generatedId = useId();
  const [image, setImage] = useState<Image | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [isInGallery, setIsInGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchData() {
      if (!id) return;
      try {
        const [imageData, tagsData, categoriesData] = await Promise.all([
          api.get<Image>(`/admin/images/${id}`, { signal: ac.signal }),
          api.get<Tag[]>("/admin/tags", { signal: ac.signal }),
          api.get<Category[]>("/admin/categories", { signal: ac.signal }),
        ]);
        setImage(imageData);
        setTags(tagsData);
        setCategories(
          [...categoriesData].sort(
            (a, b) =>
              a.display_order - b.display_order || a.name.localeCompare(b.name),
          ),
        );
        setSelectedCategoryId(imageData.category_id ?? null);
        setIsInGallery(imageData.is_in_gallery);
        const imageTags = await api.get<Tag[]>(`/tags/image/${id}`, {
          signal: ac.signal,
        });
        setSelectedTagIds(imageTags.map((t) => t.id));
      } catch (err) {
        if (isAbortError(err)) return;
        setError(notifyError(err, "Erreur lors du chargement de l'image"));
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }
    void fetchData();
    return () => ac.abort();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (isInGallery && selectedCategoryId === null) {
      toast.error(
        "Choisissez une catégorie pour une image affichée dans la galerie",
      );
      return;
    }
    const data = {
      title: (formData.get("title") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      alt_descr: (formData.get("alt_descr") as string)?.trim() || null,
      is_in_gallery: isInGallery,
      category_id: selectedCategoryId,
      tag_ids: selectedTagIds,
    };
    try {
      await api.patch(`/admin/images/${id}`, data);
      toast.success("Image mise à jour");
      navigate("/admin/images");
    } catch (err) {
      notifyError(err, "Erreur lors de la mise à jour");
    }
  }

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;
    try {
      await api.delete(`/admin/images/${id}`);
      toast.success("Image supprimée");
      navigate("/admin/images");
    } catch (err) {
      notifyError(err, "Erreur lors de la suppression");
    }
  }

  if (loading) {
    return (
      <section className="image-admin">
        <p className="image-admin-status">Chargement…</p>
      </section>
    );
  }
  if (error || !image) {
    return (
      <section className="image-admin">
        <p className="image-admin-status image-admin-status--error">
          {error ?? "Image introuvable"}
        </p>
      </section>
    );
  }

  return (
    <section className="image-admin">
      <header className="image-admin-header">
        <p className="image-admin-kicker">Galerie</p>
        <h2 className="image-admin-title">Modifier l&apos;image</h2>
      </header>
      {image.imageUrl && (
        <img
          src={image.imageUrl}
          alt={image.alt_descr || image.title || "Image"}
          className="image-admin-current"
        />
      )}
      <form onSubmit={handleSubmit} className="image-admin-form">
        <div className="image-admin-field">
          <label htmlFor={`${generatedId}-title`}>Titre</label>
          <input
            id={`${generatedId}-title`}
            type="text"
            name="title"
            defaultValue={image.title ?? ""}
            placeholder="Titre de l'image"
          />
        </div>
        <div className="image-admin-field">
          <label htmlFor={`${generatedId}-description`}>Description</label>
          <textarea
            id={`${generatedId}-description`}
            name="description"
            defaultValue={image.description ?? ""}
            placeholder="Description"
            rows={4}
          />
        </div>
        <div className="image-admin-field">
          <label htmlFor={`${generatedId}-alt_descr`}>
            Texte alternatif (alt)
          </label>
          <input
            id={`${generatedId}-alt_descr`}
            type="text"
            name="alt_descr"
            defaultValue={image.alt_descr ?? ""}
            placeholder="Description pour l'accessibilité"
          />
        </div>
        <div>
          <label
            htmlFor={`${generatedId}-is_in_gallery`}
            className="image-admin-gallery"
          >
            <input
              id={`${generatedId}-is_in_gallery`}
              type="checkbox"
              name="is_in_gallery"
              value="on"
              checked={isInGallery}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsInGallery(checked);
                if (!checked) setSelectedCategoryId(null);
              }}
            />
            Afficher dans la galerie
          </label>
        </div>
        {isInGallery ? (
          <CategoryRadios
            categories={categories}
            selectedId={selectedCategoryId}
            onChange={setSelectedCategoryId}
            name={`${generatedId}-image-edit-category`}
            idPrefix={`${generatedId}-image-edit-category`}
          />
        ) : null}
        <TagCheckboxes
          tags={tags}
          selectedIds={selectedTagIds}
          onChange={setSelectedTagIds}
          idPrefix={`${generatedId}-image-edit-tag`}
        />
        <div className="image-admin-buttons">
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => navigate("/admin/images")}>
            Annuler
          </button>
          <button
            type="button"
            className="image-admin-delete"
            onClick={handleDelete}
          >
            Supprimer
          </button>
        </div>
      </form>
    </section>
  );
}

export default ImageEdit;
