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
    <div>
      <span className="tag-checkboxes-label">Tags</span>
      <ul
        className="tag-checkboxes-list"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {tags.map((tag) => (
          <li key={tag.id}>
            <label>
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
