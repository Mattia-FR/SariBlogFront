import { useLoaderData } from "react-router-dom";
import type { ArticleLoaderData } from "./articleTypes";

function ArticlePage() {
  const data = useLoaderData<ArticleLoaderData>();

  const { article, articleImages } = data;

  return (
    <article className="article-detail">
      {/* Titre */}
      <h2>{article.title}</h2>

      {/* Date */}
      {article.published_at && (
        <p>{new Date(article.published_at).toLocaleDateString("fr-FR")}</p>
      )}

      {/* TOUTES les images liées à l'article */}
      {articleImages.map((image) => (
        <img
          key={image.id}
          src={image.imageUrl}
          alt={image.alt_descr || image.title || article.title}
        />
      ))}

      {/* Texte */}
      <p>{article.content}</p>
    </article>
  );
}

export default ArticlePage;
