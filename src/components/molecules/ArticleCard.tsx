import type { ArticleCardProps } from "../../types/article";
import Tag from "../atoms/Tag";
import "./ArticleCard.css";

function ArticleCard({ article }: ArticleCardProps) {
  const imageUrl = article.image
    ? `http://localhost:4242/images/${article.image}`
    : null;

  return (
    <article className="article-card">
      {/* Il faudrait peut-être créer un alt pour les images en dB */}
      {/* Ici && agit comme une ternaire et on affiche l'image si le premier segment est true */}
      {imageUrl && <img src={imageUrl} alt={article.title} />}
      <h4>{article.title}</h4>
      {article.excerpt && <p>{article.excerpt}</p>}
      <p className="article-date">{article.created_at}</p>
      {article.tags && (
        <section className="article-tags">
          {/* Comme il peut y avoir plusieurs tags, on split, et on map() pour les afficher */}
          {article.tags.split(", ").map((tag, index) => (
            // On crée une clé unique avec l'id et l'index, c'est plus propre
            <Tag key={`${article.id}-tag-${index}`} name={tag} />
          ))}
        </section>
      )}
    </article>
  );
}

export default ArticleCard;
