import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  useAdminArticles,
  useAdminArticleTags,
} from "../../../hooks/useAdminArticles";
import { usePagination } from "../../../hooks/usePagination";
import type {
  AdminArticle,
  AdminArticlesPageData, // ✅ Utiliser le type depuis admin.ts
  AdminTag,
  CreateArticleData,
} from "../../../types/admin";
import AdminArticleCard from "../../molecules/AdminArticleCard";
import AdminArticleForm from "../../molecules/AdminArticleForm";
import Pagination from "../../molecules/Pagination";

import "./AdminArticles.css";

function AdminArticles() {
  // ✅ Données du loader
  const loaderData = useLoaderData() as AdminArticlesPageData;
  const { articles, pagination, tags: loaderTags } = loaderData;

  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateArticleData>({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    status: "draft",
    tagIds: [],
  });

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination(12);

  // ✅ Hook SWR unifié avec fallbackData (comme la page Blog)
  const {
    data: articlesData,
    isLoading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
  } = useAdminArticles(
    limit,
    offset,
    loaderData, // ✅ Passer les données du loader comme fallback
  );

  // ✅ Hook pour les tags avec fallback
  const { tags } = useAdminArticleTags(loaderTags);

  // ✅ Utiliser les données SWR ou fallback vers le loader (comme la page Blog)
  const currentArticles = articlesData?.articles || articles;
  const currentPagination = articlesData?.pagination || pagination;
  const currentTags = tags.length > 0 ? tags : loaderTags;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createArticle(formData);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        status: "draft",
        tagIds: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur création article:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      await updateArticle(editingArticle, formData);
      setEditingArticle(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        status: "draft",
        tagIds: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur modification article:", error);
    }
  };

  const handleEdit = (article: AdminArticle) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      image: article.image || "",
      status: article.status,
      tagIds: article.tags.map((tag: AdminTag) => tag.id),
    });
    setEditingArticle(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await deleteArticle(id);
      } catch (error) {
        console.error("Erreur suppression article:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingArticle(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      status: "draft",
      tagIds: [],
    });
  };

  // ✅ Afficher le loading seulement si on n'a pas de données du loader
  if (isLoading && articles.length === 0) {
    return (
      <main className="admin-articles-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des articles...</p>
        </section>
      </main>
    );
  }

  // ✅ Afficher l'erreur seulement si on n'a pas de données du loader
  if (error && articles.length === 0) {
    return (
      <main className="admin-articles-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des articles.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-articles-page">
      {/* Header avec bouton - affiché seulement si le formulaire n'est pas visible */}
      {!showForm && (
        <header className="admin-page-header">
          <h1>Gestion des Articles</h1>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="admin-new-article-btn"
          >
            Nouvel Article
          </button>
        </header>
      )}

      {/* Formulaire - affiché seulement si showForm est true */}
      {showForm && (
        <section className="admin-form-section">
          <header className="admin-form-header">
            <h1>{editingArticle ? "Modifier l'article" : "Nouvel Article"}</h1>
          </header>
          <AdminArticleForm
            formData={formData}
            setFormData={setFormData}
            tags={currentTags}
            onSubmit={editingArticle ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!editingArticle}
          />
        </section>
      )}

      {/* Liste et pagination - affichées seulement si le formulaire n'est pas visible */}
      {!showForm && (
        <>
          {/* Pagination déplacée en haut */}
          {currentPagination && currentPagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={currentPagination.totalPages}
              onPageChange={(page) => handlePageChange(page, currentPagination)}
            />
          )}

          <section className="admin-articles-grid">
            {currentArticles.length === 0 ? (
              <p>Aucun article trouvé</p>
            ) : (
              currentArticles.map((article: AdminArticle) => (
                <AdminArticleCard
                  key={article.id}
                  article={article}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default AdminArticles;
