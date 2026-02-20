import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../../../utils/apiClient";

function ArticleCreate() {
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      status: "draft" as const,
    };

    try {
      await api.post("/admin/articles", data);
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
          <label htmlFor="article-title">Titre</label>
          <input
            id="article-title"
            type="text"
            name="title"
            placeholder="Titre de l'article"
            required
          />
        </div>
        <div>
          <label htmlFor="article-content">Contenu</label>
          <textarea
            id="article-content"
            name="content"
            placeholder="Contenu de l'article"
            rows={10}
            required
          />
        </div>
        <button type="submit">Créer l'article</button>
      </form>
    </main>
  );
}

export default ArticleCreate;
