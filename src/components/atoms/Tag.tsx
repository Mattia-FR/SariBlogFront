import type { TagProps } from "../../types/tag";
import "./Tag.css";

function Tag({ name }: TagProps) {
  return <button type="button">{name}</button>;
}

export default Tag;
