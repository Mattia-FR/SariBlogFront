import type { Category } from "../../types/categories";

interface CategoryRadiosProps {
  categories: Category[];
  selectedId: number | null;
  onChange: (id: number | null) => void;
  name: string;
  idPrefix?: string;
}

function CategoryRadios({
  categories,
  selectedId,
  onChange,
  name,
  idPrefix = "category",
}: CategoryRadiosProps) {
  return (
    <div className="category-radios">
      <h3 className="category-radios-title">Catégorie</h3>
      <ul className="category-radios-list">
        <li key="none">
          <label className="category-radios-label">
            <input
              type="radio"
              name={name}
              checked={selectedId === null}
              onChange={() => onChange(null)}
              id={`${idPrefix}-none`}
            />
            Aucune
          </label>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <label className="category-radios-label">
              <input
                type="radio"
                name={name}
                checked={selectedId === category.id}
                onChange={() => onChange(category.id)}
                id={`${idPrefix}-${category.id}`}
              />
              {category.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryRadios;
