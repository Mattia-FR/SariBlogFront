import { Link } from "react-router-dom";
import type { ArticleCardProps } from "../../types/article";
import Image from "../atoms/Image";
import TagList from "./TagList";

function ArticleCard({ article, isClickable = false }: ArticleCardProps) {
  const cardContent = (
    <article className="article-card">
      <Image src={article.image} alt={article.title} />
      <h4>{article.title}</h4>
      {article.excerpt && <p>{article.excerpt}</p>}
      <p className="article-date">{article.created_at}</p>
      <TagList tags={article.tags} articleId={article.id} />
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
