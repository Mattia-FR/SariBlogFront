import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  useAdminAbout,
  useAdminAboutHistory,
} from "../../../hooks/useAdminAbout";
import { useAdminUpload } from "../../../hooks/useAdminUpload";
import type {
  AboutHistory,
  AdminAboutPageData,
  UpdateAboutData,
} from "../../../types/admin";
import AdminAboutForm from "../../molecules/AdminAboutForm";

function AdminAbout() {
  // ✅ Ajouter useLoaderData
  const loaderData = useLoaderData() as AdminAboutPageData;
  const { about: loaderAbout, history: loaderHistory } = loaderData;

  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState<UpdateAboutData>({
    content: "",
    image: "",
  });

  // ✅ Hooks SWR avec fallback
  const { about: swrAbout, isLoading, error, updateAbout } = useAdminAbout();
  const { history: swrHistory, isLoading: historyLoading } =
    useAdminAboutHistory();
  const { uploadSingle } = useAdminUpload();

  // ✅ Utiliser les données SWR ou fallback vers le loader
  const about = swrAbout || loaderAbout;
  // ✅ S'assurer que history est toujours un tableau
  const history = Array.isArray(swrHistory)
    ? swrHistory
    : Array.isArray(loaderHistory)
      ? loaderHistory
      : [];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAbout(formData);
      setShowForm(false);
    } catch (error) {
      console.error("Erreur modification about:", error);
    }
  };

  const handleEdit = () => {
    if (about) {
      setFormData({
        content: about.content,
        image: about.image || "",
      });
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ content: "", image: "" });
  };

  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploadSingle(file);
      setFormData((prev) => ({ ...prev, image: response.file.filename }));
    } catch (error) {
      console.error("Erreur upload image:", error);
    }
  };

  // ✅ Afficher le loading seulement si on n'a pas de données du loader
  if (isLoading && !loaderAbout) {
    return (
      <main className="admin-about-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement du contenu...</p>
        </section>
      </main>
    );
  }

  // ✅ Afficher l'erreur seulement si on n'a pas de données du loader
  if (error && !loaderAbout) {
    return (
      <main className="admin-about-page">
        <section className="admin-error">
          <p>Erreur lors du chargement du contenu.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-about-page">
      <header className="admin-page-header">
        <h1>Gestion du Contenu "À propos"</h1>
        <nav className="admin-about-actions">
          <button
            type="button"
            onClick={handleEdit}
            className="admin-button primary"
          >
            Modifier le contenu
          </button>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="admin-button secondary"
          >
            {showHistory ? "Masquer" : "Afficher"} l'historique
          </button>
        </nav>
      </header>

      {about && (
        <section className="admin-about-preview">
          <h2>Aperçu du contenu actuel</h2>
          <article className="about-preview-content">
            <figure className="about-preview-image">
              {about.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/images/${about.image}`}
                  alt="Contenu à propos"
                />
              )}
            </figure>
            <section className="about-preview-text">
              {/** biome-ignore lint/security/noDangerouslySetInnerHtml: Needed. */}
              <div dangerouslySetInnerHTML={{ __html: about.content }} />
            </section>
          </article>
          <p className="about-last-updated">
            Dernière mise à jour :{" "}
            {new Date(about.updated_at).toLocaleDateString("fr-FR")}
          </p>
        </section>
      )}

      {showForm && (
        <AdminAboutForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          onImageUpload={handleImageUpload}
        />
      )}

      {showHistory && (
        <section className="admin-about-history">
          <h2>Historique des modifications</h2>
          {historyLoading ? (
            <section className="admin-loading">
              <div className="spinner"></div>
              <p>Chargement de l'historique...</p>
            </section>
          ) : (
            <ol className="history-list">
              {history.map((entry: AboutHistory) => (
                <li key={entry.id} className="history-item">
                  <time className="history-date">
                    {" "}
                    {/* ✅ time est un élément HTML valide */}
                    {new Date(entry.updated_at).toLocaleDateString("fr-FR")}
                  </time>
                  <p className="history-user">
                    Modifié par : {entry.updated_by}
                  </p>
                  <p className="history-preview">
                    {entry.content.substring(0, 200)}...
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </main>
  );
}

export default AdminAbout;
