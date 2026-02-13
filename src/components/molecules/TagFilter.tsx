import type { Tag } from "../../types/tags";

interface TagFilterProps {
  tags: Tag[];
  selectedTagId: number | "";
  onTagChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function TagFilter({ tags, selectedTagId, onTagChange }: TagFilterProps) {
  return (
    <select value={selectedTagId} onChange={onTagChange}>
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
