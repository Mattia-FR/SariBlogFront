import "./Tag.css";

type TagProps = {
  name: string;
};

function Tag({ name }: TagProps) {
  return <button type="button">{name}</button>;
}

export default Tag;
