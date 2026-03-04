import { type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import TagCheckboxes from "../../../molecules/TagCheckboxes";

function ImageCreate() {
  const navigate = useNavigate();
  const id = useId();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    api.get<Tag[]>("/tags").then(setTags).catch(() => {});
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) {
      toast.error("Veuillez sélectionner un fichier à télécharger");
      return;
    }

    if (selectedTagIds.length > 0) {
      formData.set("tag_ids", JSON.stringify(selectedTagIds));
    }

    try {
      await api.postFormData("/admin/images", formData);
      toast.success("Image créée avec succès !");
      navigate("/admin/images");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de l'image");
    }
  }

  return (
    <main>
      <h2>Nouvelle image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor={`${id}-image`}>Fichier</label>
          <input
            id={`${id}-image`}
            type="file"
            name="image"
            accept="image/*"
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-title`}>Titre</label>
          <input
            id={`${id}-title`}
            type="text"
            name="title"
            placeholder="Titre de l'image"
          />
        </div>
        <div>
          <label htmlFor={`${id}-description`}>Description</label>
          <textarea
            id={`${id}-description`}
            name="description"
            placeholder="Description"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor={`${id}-alt_descr`}>Texte alternatif (alt)</label>
          <input
            id={`${id}-alt_descr`}
            type="text"
            name="alt_descr"
            placeholder="Description pour l'accessibilité"
          />
        </div>
        <div>
          <TagCheckboxes
            tags={tags}
            selectedIds={selectedTagIds}
            onChange={setSelectedTagIds}
            idPrefix={`${id}-image-tag`}
          />
        </div>
        <div>
          <label htmlFor={`${id}-is_in_gallery`}>
            <input
              id={`${id}-is_in_gallery`}
              type="checkbox"
              name="is_in_gallery"
              value="on"
            />
            Afficher dans la galerie
          </label>
        </div>
        <button type="submit">Créer l'image</button>
      </form>
    </main>
  );
}

export default ImageCreate;
