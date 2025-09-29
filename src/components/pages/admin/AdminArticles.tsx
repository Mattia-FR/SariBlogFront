import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  useAdminArticles,
  useAdminArticleTags,
} from "../../../hooks/useAdminArticles";
import { usePagination } from "../../../hooks/usePagination";
import type {
  AdminArticle,
  AdminTag,
  CreateArticleData,
} from "../../../types/admin";
import AdminArticleCard from "../../molecules/AdminArticleCard";
import AdminArticleForm from "../../molecules/AdminArticleForm";
import Pagination from "../../molecules/Pagination";

import "./AdminArticles.css";

// Type pour les données du loader
type AdminArticlesPageData = {
  articles: AdminArticle[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
  tags: AdminTag[];
};

function AdminArticles() {
  // Garder : données du loader
  const loaderData = useLoaderData() as AdminArticlesPageData;
  console.info("🔍 [AdminArticles] Données du loader:", loaderData);

  const { articles, pagination, tags: loaderTags } = loaderData;
  console.info("🔍 [AdminArticles] Articles du loader:", articles);
  console.info("🔍 [AdminArticles] Pagination du loader:", pagination);
  console.info("🔍 [AdminArticles] Tags du loader:", loaderTags);

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
  console.info(
    "🔍 [AdminArticles] Pagination hook - limit:",
    limit,
    "offset:",
    offset,
    "currentPage:",
    currentPage,
  );

  // Hook SWR - utilise les données du loader comme fallback
  const {
    articles: swrArticles,
    pagination: swrPagination,
    isLoading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
  } = useAdminArticles(limit, offset);

  console.info("🔍 [AdminArticles] SWR Articles:", swrArticles);
  console.info("🔍 [AdminArticles] SWR Pagination:", swrPagination);
  console.info("🔍 [AdminArticles] SWR isLoading:", isLoading);
  console.info("🔍 [AdminArticles] SWR error:", error);

  const { tags: swrTags } = useAdminArticleTags();
  console.info("🔍 [AdminArticles] SWR Tags:", swrTags);

  // Utiliser les données SWR ou fallback vers le loader
  const currentArticles = swrArticles.length > 0 ? swrArticles : articles;
  const currentPagination = swrPagination || pagination;
  const currentTags = swrTags.length > 0 ? swrTags : loaderTags;

  console.info("🔍 [AdminArticles] Articles finaux:", currentArticles);
  console.info("🔍 [AdminArticles] Pagination finale:", currentPagination);
  console.info("🔍 [AdminArticles] Tags finaux:", currentTags);
  console.info(
    "🔍 [AdminArticles] Nombre d'articles à afficher:",
    currentArticles.length,
  );

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

  // Afficher le loading seulement si on n'a pas de données du loader
  if (isLoading && articles.length === 0) {
    console.info("🔍 [AdminArticles] Affichage du loading");
    return (
      <main className="admin-articles-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des articles...</p>
        </section>
      </main>
    );
  }

  // Afficher l'erreur seulement si on n'a pas de données du loader
  if (error && articles.length === 0) {
    console.info("🔍 [AdminArticles] Affichage de l'erreur:", error);
    return (
      <main className="admin-articles-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des articles.</p>
        </section>
      </main>
    );
  }

  console.info(
    "🔍 [AdminArticles] Rendu de la page avec",
    currentArticles.length,
    "articles",
  );

  return (
    <main className="admin-articles-page">
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

      {showForm && (
        <AdminArticleForm
          formData={formData}
          setFormData={setFormData}
          tags={currentTags}
          onSubmit={editingArticle ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          isEditing={!!editingArticle}
        />
      )}

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
          currentArticles.map((article: AdminArticle) => {
            console.info(
              "🔍 [AdminArticles] Rendu de l'article:",
              article.id,
              article.title,
            );
            return (
              <AdminArticleCard
                key={article.id}
                article={article}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })
        )}
      </section>
    </main>
  );
}

export default AdminArticles;
