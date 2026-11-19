import { useLoaderData, useSearchParams } from "react-router-dom";
import ArticleCard from "../../molecules/ArticleCard";
import type { BlogLoaderData } from "./blogTypes";
import "./BlogPage.css";
import NavigationPagination from "../../molecules/NavigationPagination";
import TagFilter from "../../molecules/TagFilter";

function BlogPage() {
  const { articles, tags, page, totalPages, tagId } =
    useLoaderData<BlogLoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTagId: number | "" = tagId === null ? "" : tagId;

  function handleTagChange(nextTagId: number | "") {
    const next = new URLSearchParams(searchParams);
    if (nextTagId === "") {
      next.delete("tagId");
    } else {
      next.set("tagId", String(nextTagId));
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  return (
    <section className="blog-page">
      <header className="blog-page-header">
        <div className="blog-page-heading">
          <p className="blog-page-kicker">Le blog</p>
          <h1 className="blog-page-title">Articles</h1>
        </div>
      </header>
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={handleTagChange}
      />
      {articles.length === 0 ? (
        <p className="blog-page-empty">Aucun article</p>
      ) : (
        <>
          <section className="blog-page-grid">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isClickable={true}
              />
            ))}
          </section>
          <NavigationPagination
            page={page}
            totalPages={totalPages}
            basePath="/blog"
            searchParams={searchParams}
          />
        </>
      )}
    </section>
  );
}

export default BlogPage;
