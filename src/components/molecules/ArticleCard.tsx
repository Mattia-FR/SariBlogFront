import { Link } from "react-router-dom";
import type { ArticleCardProps } from "../../types/article";
import Tag from "../atoms/Tag";
import "./ArticleCard.css";

function ArticleCard({ article, isClickable = false }: ArticleCardProps) {
  const imageUrl = article.image
    ? `${import.meta.env.VITE_API_URL}/images/${article.image}`
    : null;

  const cardContent = (
    <article className="article-card">
      {imageUrl && <img src={imageUrl} alt={article.title} />}
      <h4>{article.title}</h4>
      {article.excerpt && <p>{article.excerpt}</p>}
      <p className="article-date">{article.created_at}</p>
      {article.tags && (
        <section className="article-tags">
          {article.tags.split(", ").map((tag, index) => (
            <Tag key={`${article.id}-tag-${index}`} name={tag} />
          ))}
        </section>
      )}
    </article>
  );

  if (isClickable) {
    return (
      <Link to={`/article/${article.slug}`} className="article-card-link">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default ArticleCard;
