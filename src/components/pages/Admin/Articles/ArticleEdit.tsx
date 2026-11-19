import { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { Article } from "../../../../types/article";
import type { Image } from "../../../../types/image";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import { notifyError } from "../../../../utils/notifyError";
import TagCheckboxes from "../../../molecules/TagCheckboxes";
import "./ArticleForm.css";
import "./ArticleEdit.css";

function ArticleEdit() {
  const { id } = useParams();
  const formId = useId();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [articleImages, setArticleImages] = useState<Image[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      try {
        setLoading(true);
        const [data, tagsData] = await Promise.all([
          api.get<Article>(`/admin/articles/${id}`),
          api.get<Tag[]>("/admin/tags"),
        ]);
        setArticle(data);
        setTags(tagsData);
        setSelectedTagIds(data.tags?.map((t) => t.id) ?? []);
        const images = await api.get<Image[]>(`/images/article/${data.id}`);
        setArticleImages(images);
      } catch (err) {
        setError(notifyError(err, "Erreur lors du chargement de l'article"));
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const status = formData.get("status") as string | null;
    const featuredImageIdRaw = formData.get("featured_image_id") as
      | string
      | null;

    const data: Record<string, unknown> = {
      title: formData.get("title"),
      content: formData.get("content"),
      tag_ids: selectedTagIds,
    };

    if (status) {
      data.status = status;
    }

    // On envoie explicitement featured_image_id, y compris null si "aucune"
    if (featuredImageIdRaw && featuredImageIdRaw !== "") {
      const parsed = Number(featuredImageIdRaw);
      if (!Number.isNaN(parsed)) {
        data.featured_image_id = parsed;
      }
    } else {
      data.featured_image_id = null;
    }

    try {
      await api.patch(`/admin/articles/${id}`, data);
      toast.success("Article modifié !");
      setIsEditing(false);

      const updatedArticle = await api.get<Article>(`/admin/articles/${id}`);
      setArticle(updatedArticle);
    } catch (err) {
      notifyError(err, "Erreur lors de la modification");
    }
  }

  async function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    try {
      await api.delete(`/admin/articles/${id}`);
      toast.success("Article supprimé !");
      navigate("/admin/articles");
    } catch (err) {
      notifyError(err, "Erreur lors de la suppression");
    }
  }

  if (loading) {
    return (
      <section className="article-edit">
        <p className="article-edit-status">Chargement…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="article-edit">
        <p className="article-edit-status">{error}</p>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="article-edit">
        <p className="article-edit-status">Article introuvable</p>
      </section>
    );
  }

  if (isEditing) {
    return (
      <section className="article-edit">
        <header className="article-edit-header">
          <div className="article-edit-heading">
            <p className="article-edit-kicker">Administration</p>
            <h2 className="article-edit-title">Modifier l&apos;article</h2>
          </div>
        </header>
        <form onSubmit={handleUpdate} className="article-edit-form">
          <div className="article-edit-field">
            <label htmlFor={`${formId}-title`}>Titre</label>
            <input
              id={`${formId}-title`}
              type="text"
              name="title"
              defaultValue={article.title}
              required
            />
          </div>
          <div className="article-edit-field">
            <label htmlFor={`${formId}-content`}>Contenu</label>
            <textarea
              id={`${formId}-content`}
              name="content"
              defaultValue={article.content}
              rows={10}
              required
            />
          </div>
          <div className="article-edit-field">
            <label htmlFor={`${formId}-status`}>Statut</label>
            <select
              id={`${formId}-status`}
              name="status"
              defaultValue={article.status}
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
          <div className="article-edit-field">
            <label htmlFor={`${formId}-featured-image`}>Image à la une</label>
            <select
              id={`${formId}-featured-image`}
              name="featured_image_id"
              defaultValue={article.featured_image_id ?? ""}
            >
              <option value="">Aucune image à la une</option>
              {articleImages.map((img) => (
                <option key={img.id} value={img.id}>
                  {img.title || `Image #${img.id}`}
                </option>
              ))}
            </select>
          </div>
          <TagCheckboxes
            tags={tags}
            selectedIds={selectedTagIds}
            onChange={setSelectedTagIds}
            idPrefix={`${formId}-article-tag`}
          />
          <div className="article-edit-buttons">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Annuler
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="article-edit">
      <article className="article-edit-detail">
        <header className="article-edit-header">
          <div className="article-edit-detail-heading">
            <p className="article-edit-kicker">Administration</p>
            <h2 className="article-edit-title">{article.title}</h2>
          </div>
        </header>

        {articleImages.length > 0 ? (
          <ul className="article-edit-detail-images">
            {articleImages.map((image) => (
              <li key={image.id}>
                <img
                  src={image.imageUrl}
                  alt={image.alt_descr || image.title || article.title}
                  className="article-edit-detail-image"
                />
              </li>
            ))}
          </ul>
        ) : null}

        <p className="article-edit-detail-content">{article.content}</p>
      </article>

      <div className="article-edit-buttons">
        <button type="button" onClick={() => setIsEditing(true)}>
          Modifier
        </button>
        <button type="button" onClick={handleDelete}>
          Supprimer
        </button>
      </div>
    </section>
  );
}

export default ArticleEdit;
