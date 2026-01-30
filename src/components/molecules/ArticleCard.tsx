import { Link } from "react-router-dom";
import type { ArticleCardProps } from "../../types/article";

function ArticleCard({ article, isClickable = false }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const imageSrc = article.imageUrl ?? "/placeholder.png";

  const cardContent = (
    <article className="article-card">
      <img
        src={imageSrc}
        alt={article.title}
        loading="lazy"
        className="article-card-image"
      />

      <h4 className="article-card-title">{article.title}</h4>

      {article.excerpt && (
        <p className="article-card-excerpt">{article.excerpt}</p>
      )}

      <time className="article-card-date" dateTime={article.created_at}>
        {formatDate(article.created_at)}
      </time>

      {article.tags && article.tags.length > 0 && (
        <ul className="article-card-tags">
          {article.tags.map((tag) => (
            <li key={tag.id} className="article-card-tag">
              {tag.name}
            </li>
          ))}
        </ul>
      )}
    </article>
  );

  if (isClickable) {
    return (
      <Link to={`/blog/${article.slug}`} className="article-card-link">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default ArticleCard;
