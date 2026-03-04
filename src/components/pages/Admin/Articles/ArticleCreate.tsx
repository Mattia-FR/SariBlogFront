import { type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Article } from "../../../../types/article";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import TagCheckboxes from "../../../molecules/TagCheckboxes";

function ArticleCreate() {
  const navigate = useNavigate();
  const id = useId();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    api
      .get<Tag[]>("/tags")
      .then(setTags)
      .catch(() => {});
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      status: "draft" as const,
      tag_ids: selectedTagIds,
    };

    try {
      const newArticle = await api.post<Article>("/admin/articles", data);

      const files = formData.getAll("images") as File[];
      if (files.length > 0) {
        for (const file of files) {
          if (file.size === 0) continue;
          const imageFormData = new FormData();
          imageFormData.append("image", file);
          imageFormData.append("article_id", String(newArticle.id));
          await api.postFormData("/admin/images", imageFormData);
        }
      }

      toast.success("Article créé avec succès !");
      navigate("/admin/articles");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de l'article");
    }
  }

  return (
    <main>
      <h2>Nouvel article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor={`${id}-title`}>Titre</label>
          <input
            id={`${id}-title`}
            type="text"
            name="title"
            placeholder="Titre de l'article"
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-content`}>Contenu</label>
          <textarea
            id={`${id}-content`}
            name="content"
            placeholder="Contenu de l'article"
            rows={10}
            required
          />
        </div>
        <div>
          <TagCheckboxes
            tags={tags}
            selectedIds={selectedTagIds}
            onChange={setSelectedTagIds}
            idPrefix={`${id}-article-tag`}
          />
        </div>
        <div>
          <label htmlFor={`${id}-images`}>Images (optionnel)</label>
          <input
            id={`${id}-images`}
            type="file"
            name="images"
            accept="image/*"
            multiple
          />
        </div>
        <button type="submit">Créer l'article</button>
      </form>
    </main>
  );
}

export default ArticleCreate;
