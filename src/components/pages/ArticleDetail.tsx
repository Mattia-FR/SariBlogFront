import { useLoaderData } from "react-router-dom";
import type { ArticleDetailPageData } from "../../types/articleDetail";
import Tag from "../atoms/Tag";

function ArticleDetail() {
  const { article } = useLoaderData() as ArticleDetailPageData;

  const imageUrl = article.image
    ? `${import.meta.env.VITE_API_URL}/images/${article.image}`
    : null;

  return (
    <article className="article-detail">
      {imageUrl && <img src={imageUrl} alt={article.title} />}
      <h2>{article.title}</h2>
      <p className="article-date">{article.created_at}</p>
      {article.tags && (
        <section className="article-tags">
          {article.tags.split(", ").map((tag, index) => (
            <Tag key={`${article.id}-tag-${index}`} name={tag} />
          ))}
        </section>
      )}
      <div className="article-content">{article.content}</div>
    </article>
  );
}

export default ArticleDetail;
