import type { TagListProps } from "../../types/tagList";
import Tag from "../atoms/Tag";

function TagList({ tags, articleId, className = "" }: TagListProps) {
  if (!tags) {
    return null;
  }

  return (
    <section className={`article-tags ${className}`}>
      {tags.split(", ").map((tag) => (
        <Tag key={`${articleId}-tag-${tag}`} name={tag} />
      ))}
    </section>
  );
}

export default TagList;
