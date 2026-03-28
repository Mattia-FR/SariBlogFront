import { type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Category } from "../../../../types/categories";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import CategoryRadios from "../../../molecules/CategoryRadios";
import TagCheckboxes from "../../../molecules/TagCheckboxes";
import "./ImageCreate.css";

function ImageCreate() {
  const navigate = useNavigate();
  const id = useId();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [isInGallery, setIsInGallery] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<Tag[]>("/admin/tags"),
      api.get<Category[]>("/admin/categories"),
    ])
      .then(([tagsData, categoriesData]) => {
        setTags(tagsData);
        setCategories(
          [...categoriesData].sort(
            (a, b) =>
              a.display_order - b.display_order || a.name.localeCompare(b.name),
          ),
        );
      })
      .catch(() => {});
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

    if (isInGallery && selectedCategoryId === null) {
      toast.error(
        "Choisissez une catégorie pour une image affichée dans la galerie",
      );
      return;
    }

    if (selectedTagIds.length > 0) {
      formData.set("tag_ids", JSON.stringify(selectedTagIds));
    }
    if (selectedCategoryId !== null) {
      formData.set("category_id", String(selectedCategoryId));
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
    <section className="image-admin-create">
      <h2 className="image-admin-create-title">Nouvelle image</h2>
      <form onSubmit={handleSubmit} className="image-admin-create-form">
        <div className="image-admin-create-field">
          <label htmlFor={`${id}-image`}>Fichier :</label>
          <input
            id={`${id}-image`}
            type="file"
            name="image"
            accept="image/*"
            required
          />
        </div>
        <div className="image-admin-create-field">
          <label htmlFor={`${id}-title`}>Titre :</label>
          <input
            id={`${id}-title`}
            type="text"
            name="title"
            placeholder="Titre de l'image"
          />
        </div>
        <div className="image-admin-create-field">
          <label htmlFor={`${id}-description`}>Description :</label>
          <textarea
            id={`${id}-description`}
            name="description"
            placeholder="Description"
            rows={4}
          />
        </div>
        <div className="image-admin-create-field">
          <label htmlFor={`${id}-alt_descr`}>Texte alternatif (alt) :</label>
          <input
            id={`${id}-alt_descr`}
            type="text"
            name="alt_descr"
            placeholder="Description pour l'accessibilité"
          />
        </div>
        <div>
          <label
            htmlFor={`${id}-is_in_gallery`}
            className="image-admin-create-gallery"
          >
            <input
              id={`${id}-is_in_gallery`}
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
          <div>
            <CategoryRadios
              categories={categories}
              selectedId={selectedCategoryId}
              onChange={setSelectedCategoryId}
              name={`${id}-image-category`}
              idPrefix={`${id}-image-category`}
            />
          </div>
        ) : null}
        <div>
          <TagCheckboxes
            tags={tags}
            selectedIds={selectedTagIds}
            onChange={setSelectedTagIds}
            idPrefix={`${id}-image-tag`}
          />
        </div>
        <div className="image-admin-create-buttons">
          <button type="submit">Créer l&apos;image</button>
          <button type="button" onClick={() => navigate("/admin/images")}>
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}

export default ImageCreate;
