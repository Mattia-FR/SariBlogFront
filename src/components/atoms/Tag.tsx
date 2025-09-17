import type { TagProps } from "../../types/tag";

function Tag({ name }: TagProps) {
  return <button type="button">{name}</button>;
}

export default Tag;
