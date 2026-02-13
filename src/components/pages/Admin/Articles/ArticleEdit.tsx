import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Article } from "../../../../types/article";
import type { Image } from "../../../../types/image";
import { api } from "../../../../utils/apiClient";

function ArticleEdit() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [articleImages, setArticleImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);

        const data = await api.get<Article>(`/admin/articles/${id}`);
        console.log("API response:", data);

        setArticle(data);
        const images = await api.get<Image[]>(`/images/article/${data.id}`);
        setArticleImages(images);
      } catch (err) {
        setError("Erreur lors du chargement");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title"),
      content: formData.get("content"),
    };

    try {
      await api.patch(`/admin/articles/${id}`, data);
      alert("Article modifié !");
      setIsEditing(false);

      const updatedArticle = await api.get<Article>(`/admin/articles/${id}`);
      setArticle(updatedArticle);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    }
  }

  async function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    try {
      await api.delete(`/admin/articles/${id}`);
      alert("Article supprimé !");
      navigate("/admin/articles");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  }

  // Affichage pendant le chargement
  if (loading) return <p>Chargement...</p>;

  // Affichage si erreur
  if (error) return <p>{error}</p>;

  // Affichage si pas d'article
  if (!article) return <p>Article introuvable</p>;

  // MODE ÉDITION
  if (isEditing) {
    return (
      <main>
        <h2>Modifier l'article</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="title"
            defaultValue={article.title}
            required
          />
          <textarea
            name="content"
            defaultValue={article.content}
            rows={10}
            required
          />
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Annuler
          </button>
        </form>
      </main>
    );
  }

  // MODE AFFICHAGE
  return (
    <main>
      <article className="article-detail">
        <h2>{article.title}</h2>

        {articleImages.map((image) => (
          <img
            key={image.id}
            src={image.imageUrl}
            alt={image.alt_descr || image.title || article.title}
          />
        ))}

        <p>{article.content}</p>
      </article>

      <div>
        <button type="button" onClick={() => setIsEditing(true)}>
          Modifier
        </button>
        <button type="button" onClick={handleDelete}>
          Supprimer
        </button>
      </div>
    </main>
  );
}

export default ArticleEdit;
