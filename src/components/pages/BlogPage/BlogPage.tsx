import type { ChangeEvent } from "react";
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

  function handleTagChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams);
    const v = e.target.value;
    if (v === "") {
      next.delete("tagId");
    } else {
      next.set("tagId", v);
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  if (articles.length === 0) {
    return (
      <main className="blog-articles-preview">
        <TagFilter
          tags={tags}
          selectedTagId={selectedTagId}
          onTagChange={handleTagChange}
        />
        <p>Aucun article</p>
      </main>
    );
  }

  return (
    <main className="blog-articles-preview">
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={handleTagChange}
      />
      <section className="articles-preview-grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} isClickable={true} />
        ))}
      </section>
      <NavigationPagination
        page={page}
        totalPages={totalPages}
        basePath="/blog"
        searchParams={searchParams}
      />
    </main>
  );
}

export default BlogPage;
