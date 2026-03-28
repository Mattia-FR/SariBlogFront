import type { Tag } from "../../types/tags";

interface TagCheckboxesProps {
  tags: Tag[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  name?: string;
  idPrefix?: string;
}

function TagCheckboxes({
  tags,
  selectedIds,
  onChange,
  name = "tag_ids",
  idPrefix = "tag",
}: TagCheckboxesProps) {
  function toggle(tagId: number) {
    if (selectedIds.includes(tagId)) {
      onChange(selectedIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedIds, tagId]);
    }
  }

  return (
    <div className="tag-checkboxes">
      <h3 className="tag-checkboxes-title">Tags</h3>
      <ul className="tag-checkboxes-list">
        {tags.map((tag) => (
          <li key={tag.id}>
            <label className="tag-checkboxes-label">
              <input
                type="checkbox"
                name={name}
                value={tag.id}
                checked={selectedIds.includes(tag.id)}
                onChange={() => toggle(tag.id)}
                id={`${idPrefix}-${tag.id}`}
              />
              {tag.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TagCheckboxes;
