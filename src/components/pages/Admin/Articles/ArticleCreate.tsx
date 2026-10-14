import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Article, ArticleStatus } from "../../../../types/article";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import { getErrorMessage } from "../../../../utils/apiError";
import {
  getImageFileError,
  IMAGE_ACCEPT,
} from "../../../../utils/imageConstraints";
import { notifyError } from "../../../../utils/notifyError";
import TagCheckboxes from "../../../molecules/TagCheckboxes";
import "./ArticleCreate.css";

function ArticleCreate() {
  const navigate = useNavigate();
  const id = useId();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<Tag[]>("/admin/tags")
      .then(setTags)
      .catch((err) => notifyError(err, "Impossible de charger les tags"));
  }, []);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter(
      (file) => file.size > 0,
    );

    for (const file of files) {
      const fileError = getImageFileError(file);
      if (fileError) {
        toast.error(`${file.name} : ${fileError}`);
        event.target.value = "";
        setPreviewUrls([]);
        return;
      }
    }

    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const rawStatus = String(formData.get("status") ?? "draft");
    const status: ArticleStatus =
      rawStatus === "published" || rawStatus === "archived"
        ? rawStatus
        : "draft";

    const data = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      status,
      tag_ids: selectedTagIds,
    };

    const files = (formData.getAll("images") as File[]).filter(
      (file) => file.size > 0,
    );
    for (const file of files) {
      const fileError = getImageFileError(file);
      if (fileError) {
        toast.error(`${file.name} : ${fileError}`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let newArticle: Article;
      try {
        newArticle = await api.post<Article>("/admin/articles", data);
      } catch (error) {
        notifyError(error, "Erreur lors de la création de l'article");
        return;
      }

      // L'article existe : un échec d'upload ne doit ni l'annuler ni passer inaperçu.
      const results = await Promise.allSettled(
        files.map((file) => {
          const imageFormData = new FormData();
          imageFormData.append("image", file);
          imageFormData.append("article_id", String(newArticle.id));
          return api.postFormData("/admin/images", imageFormData);
        }),
      );

      const failures = results.flatMap((result, index) =>
        result.status === "rejected"
          ? [
              `${files[index].name} : ${getErrorMessage(result.reason, "échec")}`,
            ]
          : [],
      );

      if (failures.length === 0) {
        toast.success("Article créé avec succès !");
      } else {
        toast.warning(
          `Article créé, mais ${failures.length}/${files.length} image(s) non envoyée(s) — ${failures.join(" ; ")}`,
          { autoClose: false },
        );
      }
      navigate("/admin/articles");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="article-create">
      <h2 className="article-create-title">Nouvel article</h2>
      <form onSubmit={handleSubmit} className="article-create-form">
        <div className="article-create-field">
          <label htmlFor={`${id}-title`}>Titre :</label>
          <input
            id={`${id}-title`}
            type="text"
            name="title"
            placeholder="Titre de l'article"
            required
          />
        </div>
        <div className="article-create-field">
          <label htmlFor={`${id}-content`}>Contenu :</label>
          <textarea
            id={`${id}-content`}
            name="content"
            placeholder="Contenu de l'article"
            rows={10}
            required
          />
        </div>
        <div className="article-create-field">
          <label htmlFor={`${id}-status`}>Statut</label>
          <select id={`${id}-status`} name="status" defaultValue="draft">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
        <div>
          <TagCheckboxes
            tags={tags}
            selectedIds={selectedTagIds}
            onChange={setSelectedTagIds}
            idPrefix={`${id}-article-tag`}
          />
        </div>
        <div className="article-create-field">
          <label htmlFor={`${id}-images`}>Images (optionnel) :</label>
          <input
            id={`${id}-images`}
            type="file"
            name="images"
            accept={IMAGE_ACCEPT}
            multiple
            onChange={handleImagesChange}
          />
          {previewUrls.length > 0 ? (
            <ul className="article-create-previews">
              {previewUrls.map((url) => (
                <li key={url}>
                  <img src={url} alt="" className="article-create-preview" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="article-create-buttons">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours…" : "Créer l'article"}
          </button>
          <button type="button" onClick={() => navigate("/admin/articles")}>
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}

export default ArticleCreate;
