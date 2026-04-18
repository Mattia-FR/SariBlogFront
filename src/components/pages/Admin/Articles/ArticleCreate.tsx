import { type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Article, ArticleStatus } from "../../../../types/article";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import TagCheckboxes from "../../../molecules/TagCheckboxes";
import "./ArticleCreate.css";

function ArticleCreate() {
  const navigate = useNavigate();
  const id = useId();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    api
      .get<Tag[]>("/admin/tags")
      .then(setTags)
      .catch(() => {});
  }, []);

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

    try {
      const newArticle = await api.post<Article>("/admin/articles", data);

      const files = formData.getAll("images") as File[];
      if (files.length > 0) {
        for (const file of files) {
          if (file.size === 0) continue;
          const imageFormData = new FormData();
          imageFormData.append("image", file);
          imageFormData.append("article_id", String(newArticle.id));
          await api.postFormData("/admin/images", imageFormData);
        }
      }

      toast.success("Article créé avec succès !");
      navigate("/admin/articles");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de l'article");
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
            accept="image/*"
            multiple
          />
        </div>
        <div className="article-create-buttons">
          <button type="submit">Créer l&apos;article</button>
          <button type="button" onClick={() => navigate("/admin/articles")}>
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}

export default ArticleCreate;
