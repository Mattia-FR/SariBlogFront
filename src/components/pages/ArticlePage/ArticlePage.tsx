import { useLoaderData } from "react-router-dom";
import type { ArticleLoaderData } from "./articleTypes";
import "./ArticlePage.css";

function ArticlePage() {
  const data = useLoaderData<ArticleLoaderData>();

  const { article, articleImages } = data;

  return (
    <main className="article-detail">
      <h1 className="article-title">{article.title}</h1>

      {article.published_at && (
        <p className="article-date">
          {new Date(article.published_at).toLocaleDateString("fr-FR")}
        </p>
      )}

      {article.tags && article.tags.length > 0 && (
        <ul className="article-detail-tags">
          {article.tags.map((tag) => (
            <li key={tag.id} className="article-detail-tag">
              {tag.name}
            </li>
          ))}
        </ul>
      )}

      <div className="article-images">
        {articleImages.map((image) => (
          <img
            key={image.id}
            src={image.imageUrl}
            alt={image.alt_descr || image.title || article.title}
          />
        ))}
      </div>

      <p>{article.content}</p>
    </main>
  );
}

export default ArticlePage;
