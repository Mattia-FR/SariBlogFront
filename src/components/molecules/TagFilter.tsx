import { useState } from "react";
import type { Tag } from "../../types/tags";
import "./TagFilter.css";

const VISIBLE_TAG_COUNT = 6;

interface TagFilterProps {
  tags: Tag[];
  selectedTagId: number | "";
  onTagChange: (tagId: number | "") => void;
}

function TagFilter({ tags, selectedTagId, onTagChange }: TagFilterProps) {
  const [expanded, setExpanded] = useState(false);

  const selectedTag =
    selectedTagId === ""
      ? null
      : (tags.find((tag) => tag.id === selectedTagId) ?? null);

  let visibleTags: Tag[];
  if (expanded || tags.length <= VISIBLE_TAG_COUNT) {
    visibleTags = tags;
  } else {
    const firstTags = tags.slice(0, VISIBLE_TAG_COUNT);
    const selectedOutside = selectedTag
      ? !firstTags.some((tag) => tag.id === selectedTag.id)
      : false;
    visibleTags =
      selectedOutside && selectedTag
        ? [...firstTags.slice(0, VISIBLE_TAG_COUNT - 1), selectedTag]
        : firstTags;
  }

  const hiddenCount = Math.max(0, tags.length - VISIBLE_TAG_COUNT);
  const showToggle = tags.length > VISIBLE_TAG_COUNT;

  return (
    <div className="tag-filter" role="group" aria-label="Filtrer par tag">
      <button
        type="button"
        className={`tag-filter-chip${selectedTagId === "" ? " tag-filter-chip--active" : ""}`}
        aria-pressed={selectedTagId === ""}
        onClick={() => onTagChange("")}
      >
        Tous
      </button>

      {visibleTags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          className={`tag-filter-chip${selectedTagId === tag.id ? " tag-filter-chip--active" : ""}`}
          aria-pressed={selectedTagId === tag.id}
          onClick={() => onTagChange(tag.id)}
        >
          {tag.name}
        </button>
      ))}

      {showToggle && (
        <button
          type="button"
          className="tag-filter-more"
          aria-expanded={expanded}
          aria-label={
            expanded
              ? "Réduire la liste des tags"
              : `Afficher ${hiddenCount} tag${hiddenCount > 1 ? "s" : ""} de plus`
          }
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "−" : `+${hiddenCount}`}
        </button>
      )}
    </div>
  );
}

export default TagFilter;
