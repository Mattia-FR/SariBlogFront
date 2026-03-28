import { useId } from "react";
import type { Tag } from "../../types/tags";
import "./TagFilter.css";

interface TagFilterProps {
  tags: Tag[];
  selectedTagId: number | "";
  onTagChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function TagFilter({ tags, selectedTagId, onTagChange }: TagFilterProps) {
  const tagFilterId = useId();

  return (
    <select
      id={tagFilterId}
      value={selectedTagId}
      onChange={onTagChange}
      className="tag-filter-btn"
      aria-label="Filtrer par tag"
    >
      <option value="">Tous les tags</option>
      {tags.map((tag) => (
        <option key={tag.id} value={tag.id}>
          {tag.name}
        </option>
      ))}
    </select>
  );
}

export default TagFilter;
