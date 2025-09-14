import { useLoaderData, useSearchParams } from "react-router-dom";
import type { ArticlesPageData } from "../../types/articlesPage";
import ArticleCard from "../molecules/ArticleCard";
import Pagination from "../molecules/Pagination";

function ArticlesPage() {
  const { articles, pagination } = useLoaderData() as ArticlesPageData;
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage =
    Math.floor(
      Number.parseInt(searchParams.get("offset") || "0", 10) /
        Number.parseInt(searchParams.get("limit") || "12", 10),
    ) + 1;

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * pagination.limit;
    setSearchParams({
      offset: newOffset.toString(),
      limit: pagination.limit.toString(),
    });
  };

  return (
    <section className="articles-page">
      <h1>Articles</h1>
      <section className="articles-grid">
        {articles.map((article) => (
          <ArticleCard
            key={`articles-page-${article.id}`}
            article={article}
            isClickable={true}
          />
        ))}
      </section>
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default ArticlesPage;
