import type { FormEvent } from "react";
import { api } from "../../../../utils/apiClient";

function ArticleCreate() {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Pour éviter le rechargement de la page

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title"),
      content: formData.get("content"),
    };

    try {
      await api.post("/articles", data);
      alert("Article créé avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création de l'article");
    }
  }

  return (
    <main>
      <h2>Nouvel article</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Titre de l'article"
          required
        />
        <textarea
          name="content"
          placeholder="Contenu de l'article"
          rows={10}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
    </main>
  );
}

export default ArticleCreate;
