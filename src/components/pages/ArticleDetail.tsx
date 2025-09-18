import { useLoaderData } from "react-router-dom";
import { useArticleBySlug } from "../../hooks/useArticleBySlug";
import type { ArticleDetailPageData } from "../../types/articleDetail";
import Image from "../atoms/Image";
import TagList from "../molecules/TagList";

function ArticleDetail() {
  // Garder : données du loader
  const { article } = useLoaderData() as ArticleDetailPageData;

  // Ajouter : hook SWR avec fallback
  const { data: articleData } = useArticleBySlug(article.slug, article);

  // Utiliser les données SWR ou fallback vers le loader
  const currentArticle = articleData?.data?.article || article;

  return (
    <article className="article-detail">
      <Image src={currentArticle.image} alt={currentArticle.title} />
      <h2>{currentArticle.title}</h2>
      <p className="article-date">{currentArticle.created_at}</p>
      <TagList tags={currentArticle.tags} articleId={currentArticle.id} />
      <div className="article-content">{currentArticle.content}</div>
    </article>
  );
}

export default ArticleDetail;
