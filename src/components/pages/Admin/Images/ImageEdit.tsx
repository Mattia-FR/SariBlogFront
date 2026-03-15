import { type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { Image } from "../../../../types/image";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import TagCheckboxes from "../../../molecules/TagCheckboxes";
import "./ImageEdit.css";

function ImageEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const generatedId = useId();
  const [image, setImage] = useState<Image | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const [imageData, tagsData] = await Promise.all([
          api.get<Image>(`/admin/images/${id}`),
          api.get<Tag[]>("/tags"),
        ]);
        setImage(imageData);
        setTags(tagsData);
        const imageTags = await api.get<Tag[]>(`/tags/image/${id}`);
        setSelectedTagIds(imageTags.map((t) => t.id));
      } catch (err) {
        setError("Erreur lors du chargement de l'image");
        toast.error("Erreur lors du chargement");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      title: (formData.get("title") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      alt_descr: (formData.get("alt_descr") as string)?.trim() || null,
      is_in_gallery: formData.get("is_in_gallery") === "on",
      tag_ids: selectedTagIds,
    };
    try {
      await api.patch(`/admin/images/${id}`, data);
      toast.success("Image mise à jour");
      navigate("/admin/images");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
      console.error(err);
    }
  }

  if (loading) return <p>Chargement…</p>;
  if (error || !image) return <p>{error ?? "Image introuvable"}</p>;

  return (
    <main className="image-admin-edit">
      <h2 className="image-admin-edit-title">Modifier l&apos;image</h2>
      {image.imageUrl && (
        <img
          src={image.imageUrl}
          alt={image.alt_descr || image.title || "Image"}
          className="image-admin-edit-image"
        />
      )}
      <form onSubmit={handleSubmit} className="image-admin-edit-form">
        <div className="image-admin-edit-field">
          <label htmlFor={`${generatedId}-title`}>Titre :</label>
          <input
            id={`${generatedId}-title`}
            type="text"
            name="title"
            defaultValue={image.title ?? ""}
            placeholder="Titre de l'image"
          />
        </div>
        <div className="image-admin-edit-field">
          <label htmlFor={`${generatedId}-description`}>Description :</label>
          <textarea
            id={`${generatedId}-description`}
            name="description"
            defaultValue={image.description ?? ""}
            placeholder="Description"
            rows={4}
          />
        </div>
        <div className="image-admin-edit-field">
          <label htmlFor={`${generatedId}-alt_descr`}>
            Texte alternatif (alt) :
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
          <TagCheckboxes
            tags={tags}
            selectedIds={selectedTagIds}
            onChange={setSelectedTagIds}
            idPrefix={`${generatedId}-image-edit-tag`}
          />
        </div>
        <div>
          <label
            htmlFor={`${generatedId}-is_in_gallery`}
            className="image-admin-edit-gallery"
          >
            <input
              id={`${generatedId}-is_in_gallery`}
              type="checkbox"
              name="is_in_gallery"
              value="on"
              defaultChecked={image.is_in_gallery}
            />
            Afficher dans la galerie
          </label>
        </div>
        <div className="image-admin-edit-buttons">
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => navigate("/admin/images")}>
            Annuler
          </button>
        </div>
      </form>
    </main>
  );
}

export default ImageEdit;
