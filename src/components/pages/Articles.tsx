import { useLoaderData, useSearchParams } from "react-router-dom";
import { useArticles } from "../../hooks/useArticles";
import type { Article } from "../../types/article";
import type { ArticlesPageData } from "../../types/articlesPage";
import ArticleCard from "../molecules/ArticleCard";
import Pagination from "../molecules/Pagination";

function ArticlesPage() {
  // Garder : données du loader
  const { articles, pagination } = useLoaderData() as ArticlesPageData;
  const [searchParams, setSearchParams] = useSearchParams();

  // Ajouter : hook SWR avec fallback
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10);
  const offset = Number.parseInt(searchParams.get("offset") || "0", 10);
  const { data: articlesData } = useArticles(limit, offset, {
    articles,
    pagination,
  });

  // Utiliser les données SWR ou fallback vers le loader
  const currentArticles = articlesData?.articles || articles;
  const currentPagination = articlesData?.pagination || pagination;

  const currentPage =
    Math.floor(
      Number.parseInt(searchParams.get("offset") || "0", 10) /
        Number.parseInt(searchParams.get("limit") || "12", 10),
    ) + 1;

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * currentPagination.limit;
    setSearchParams({
      offset: newOffset.toString(),
      limit: currentPagination.limit.toString(),
    });
  };

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
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default ArticlesPage;
