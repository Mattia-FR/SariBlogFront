import { useLoaderData } from "react-router-dom";
import { useArticleBySlug } from "../../hooks/useArticleBySlug";
import type { ArticleDetailPageData } from "../../types/articleDetail";
import Tag from "../atoms/Tag";

function ArticleDetail() {
  // Garder : données du loader
  const { article } = useLoaderData() as ArticleDetailPageData;

  // Ajouter : hook SWR avec fallback
  const { data: articleData } = useArticleBySlug(article.slug, article);

  // Utiliser les données SWR ou fallback vers le loader
  const currentArticle = articleData?.data?.article || article;

  const imageUrl = currentArticle.image
    ? `${import.meta.env.VITE_API_URL}/images/${currentArticle.image}`
    : null;

  return (
    <article className="article-detail">
      {imageUrl && <img src={imageUrl} alt={currentArticle.title} />}
      <h2>{currentArticle.title}</h2>
      <p className="article-date">{currentArticle.created_at}</p>
      {currentArticle.tags && (
        <section className="article-tags">
          {currentArticle.tags.split(", ").map((tag: string) => (
            <Tag key={`${currentArticle.id}-tag-${tag}`} name={tag} />
          ))}
        </section>
      )}
      <div className="article-content">{currentArticle.content}</div>
    </article>
  );
}

export default ArticleDetail;
