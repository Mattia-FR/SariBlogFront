import { useLoaderData } from "react-router-dom";
import type { ArticleLoaderData } from "./articleTypes";

function ArticlePage() {
  const data = useLoaderData<ArticleLoaderData>();

  const { article, articleImages } = data;

  return (
    <article className="article-detail">
      {/* Titre */}
      <h1>{article.title}</h1>

      {/* Date */}
      {article.published_at && (
        <p>{new Date(article.published_at).toLocaleDateString("fr-FR")}</p>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <ul className="article-detail-tags">
          {article.tags.map((tag) => (
            <li key={tag.id} className="article-detail-tag">
              {tag.name}
            </li>
          ))}
        </ul>
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
