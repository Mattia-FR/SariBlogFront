import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useAdminTags } from "../../../hooks/useAdminTags";
import { usePagination } from "../../../hooks/usePagination";
import type {
  AdminTag,
  AdminTagsPageData,
  CreateTagData,
} from "../../../types/admin";
import AdminTagCard from "../../molecules/AdminTagCard";
import AdminTagForm from "../../molecules/AdminTagForm";
import Pagination from "../../molecules/Pagination";

import "./AdminTags.css";

function AdminTags() {
  console.info("🔍 [COMPONENT TAGS] Rendu du composant");

  // ✅ Ajouter useLoaderData
  const loaderData = useLoaderData() as AdminTagsPageData;
  const { tags: loaderTags, pagination: loaderPagination } = loaderData; // ✅ Supprimer stats

  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateTagData>({
    name: "",
  });

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination(12);
  console.info("🔍 [COMPONENT TAGS] Pagination:", {
    limit,
    offset,
    currentPage,
  });

  // ✅ Hook SWR avec fallback
  const {
    tags: swrTags,
    pagination: swrPagination,
    isLoading,
    error,
    createTag,
    updateTag,
    deleteTag,
  } = useAdminTags(limit, offset);

  // ✅ Utiliser les données SWR ou fallback vers le loader
  const tags = swrTags.length > 0 ? swrTags : loaderTags;
  const pagination = swrPagination || loaderPagination;

  console.info("🔍 [COMPONENT TAGS] Tags:", tags);
  console.info("🔍 [COMPONENT TAGS] Pagination:", pagination);
  console.info("🔍 [COMPONENT TAGS] IsLoading:", isLoading);
  console.info("🔍 [COMPONENT TAGS] Error:", error);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTag(formData);
      setFormData({ name: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur création tag:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    try {
      await updateTag(editingTag, formData);
      setEditingTag(null);
      setFormData({ name: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur modification tag:", error);
    }
  };

  const handleEdit = (tag: AdminTag) => {
    setFormData({ name: tag.name });
    setEditingTag(tag.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) {
      try {
        await deleteTag(id);
      } catch (error) {
        console.error("Erreur suppression tag:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTag(null);
    setFormData({ name: "" });
  };

  // ✅ Afficher le loading seulement si on n'a pas de données du loader
  if (isLoading && loaderTags.length === 0) {
    console.info("🔍 [COMPONENT TAGS] Affichage du loading");
    return (
      <main className="admin-tags-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des tags...</p>
        </section>
      </main>
    );
  }

  // ✅ Afficher l'erreur seulement si on n'a pas de données du loader
  if (error && loaderTags.length === 0) {
    console.info("🔍 [COMPONENT TAGS] Affichage de l'erreur:", error);
    return (
      <main className="admin-tags-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des tags.</p>
        </section>
      </main>
    );
  }

  console.info(
    "🔍 [COMPONENT TAGS] Rendu de la page avec",
    tags.length,
    "tags",
  );

  return (
    <main className="admin-tags-page">
      {/* Header avec bouton - affiché seulement si le formulaire n'est pas visible */}
      {!showForm && (
        <header className="admin-page-header">
          <h1>Gestion des Tags</h1>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="admin-new-tag-btn"
          >
            Nouveau Tag
          </button>
        </header>
      )}

      {/* Formulaire - affiché seulement si showForm est true */}
      {showForm && (
        <section className="admin-form-section">
          <header className="admin-form-header">
            <h1>{editingTag ? "Modifier le tag" : "Nouveau Tag"}</h1>
          </header>
          <AdminTagForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={editingTag ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!editingTag}
          />
        </section>
      )}

      {/* Liste et pagination - affichées seulement si le formulaire n'est pas visible */}
      {!showForm && (
        <>
          {/* Pagination déplacée en haut */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => handlePageChange(page, pagination)}
            />
          )}

          <section className="admin-tags-grid">
            {tags.length === 0 ? (
              <p>Aucun tag trouvé</p>
            ) : (
              tags.map((tag) => (
                <AdminTagCard
                  key={tag.id}
                  tag={tag}
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

export default AdminTags;
