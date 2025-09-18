import { useLoaderData } from "react-router-dom";
import { useArticles } from "../../hooks/useArticles";
import { usePagination } from "../../hooks/usePagination";
import type { Article } from "../../types/article";
import type { ArticlesPageData } from "../../types/articlesPage";
import ArticleCard from "../molecules/ArticleCard";
import Pagination from "../molecules/Pagination";

function ArticlesPage() {
  // Garder : données du loader
  const { articles, pagination } = useLoaderData() as ArticlesPageData;

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination();

  // Ajouter : hook SWR avec fallback
  const { data: articlesData } = useArticles(limit, offset, {
    articles,
    pagination,
  });

  // Utiliser les données SWR ou fallback vers le loader
  const currentArticles = articlesData?.articles || articles;
  const currentPagination = articlesData?.pagination || pagination;

  return (
    <section className="articles-page">
      <h1>Articles</h1>
      <section className="articles-grid">
        {currentArticles.map((article: Article) => (
          <ArticleCard
            key={`articles-page-${article.id}`}
            article={article}
            isClickable={true}
          />
        ))}
      </section>
      <Pagination
        currentPage={currentPage}
        totalPages={currentPagination.totalPages}
        onPageChange={(page) => handlePageChange(page, currentPagination)}
      />
    </section>
  );
}

export default ArticlesPage;
