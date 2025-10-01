import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  useAdminIllustrations,
  useAdminIllustrationTags,
} from "../../../hooks/useAdminIllustrations";
import { usePagination } from "../../../hooks/usePagination";
import type {
  AdminIllustration,
  AdminIllustrationsPageData, // ✅ Import du type depuis admin.ts
  AdminTag,
  CreateIllustrationData,
} from "../../../types/admin";
import AdminIllustrationCard from "../../molecules/AdminIllustrationCard";
import AdminIllustrationForm from "../../molecules/AdminIllustrationForm";
import Pagination from "../../molecules/Pagination";

import "./AdminIllustrations.css";

function AdminIllustrations() {
  console.info("🔍 [COMPONENT ILLUSTRATIONS] Rendu du composant");

  // ✅ Utiliser useLoaderData avec le type correct
  const loaderData = useLoaderData() as AdminIllustrationsPageData;
  console.info("🔍 [AdminIllustrations] Données du loader:", loaderData);

  const {
    illustrations: loaderIllustrations,
    pagination: loaderPagination,
    tags: loaderTags,
  } = loaderData;
  console.info(
    "🔍 [AdminIllustrations] Illustrations du loader:",
    loaderIllustrations,
  );
  console.info(
    "🔍 [AdminIllustrations] Pagination du loader:",
    loaderPagination,
  );
  console.info("🔍 [AdminIllustrations] Tags du loader:", loaderTags);

  const [showForm, setShowForm] = useState(false);
  const [editingIllustration, setEditingIllustration] = useState<number | null>(
    null,
  );
  const [formData, setFormData] = useState<CreateIllustrationData>({
    title: "",
    description: "",
    image: "",
    alt_text: "",
    is_in_gallery: true,
    tagIds: [],
  });

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination(12);
  console.info("🔍 [COMPONENT ILLUSTRATIONS] Pagination:", {
    limit,
    offset,
    currentPage,
  });

  // ✅ Hooks SWR avec fallback
  const {
    illustrations: swrIllustrations,
    pagination: swrPagination,
    isLoading,
    error,
    createIllustration,
    updateIllustration,
    deleteIllustration,
  } = useAdminIllustrations(limit, offset);

  console.info("🔍 [AdminIllustrations] SWR Illustrations:", swrIllustrations);
  console.info("🔍 [AdminIllustrations] SWR Pagination:", swrPagination);
  console.info("🔍 [AdminIllustrations] SWR IsLoading:", isLoading);
  console.info("🔍 [AdminIllustrations] SWR Error:", error);

  const { tags: swrTags } = useAdminIllustrationTags();
  console.info("🔍 [AdminIllustrations] SWR Tags:", swrTags);

  // ✅ Utiliser les données SWR ou fallback vers le loader
  const currentIllustrations =
    swrIllustrations.length > 0 ? swrIllustrations : loaderIllustrations;
  const currentPagination = swrPagination || loaderPagination;
  const currentTags = swrTags.length > 0 ? swrTags : loaderTags;

  console.info(
    "🔍 [AdminIllustrations] Illustrations finaux:",
    currentIllustrations,
  );
  console.info("🔍 [AdminIllustrations] Pagination finale:", currentPagination);
  console.info("🔍 [AdminIllustrations] Tags finaux:", currentTags);
  console.info(
    "🔍 [AdminIllustrations] Nombre d'illustrations à afficher:",
    currentIllustrations.length,
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createIllustration(formData);
      setFormData({
        title: "",
        description: "",
        image: "",
        alt_text: "",
        is_in_gallery: true,
        tagIds: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur création illustration:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIllustration) return;

    try {
      await updateIllustration(editingIllustration, formData);
      setEditingIllustration(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        alt_text: "",
        is_in_gallery: true,
        tagIds: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur modification illustration:", error);
    }
  };

  const handleEdit = (illustration: AdminIllustration) => {
    setFormData({
      title: illustration.title,
      description: illustration.description || "",
      image: illustration.image,
      alt_text: illustration.alt_text,
      is_in_gallery: illustration.is_in_gallery,
      tagIds: illustration.tags.map((tag: AdminTag) => tag.id),
    });
    setEditingIllustration(illustration.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette illustration ?")) {
      try {
        await deleteIllustration(id);
      } catch (error) {
        console.error("Erreur suppression illustration:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIllustration(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      alt_text: "",
      is_in_gallery: true,
      tagIds: [],
    });
  };

  // ✅ Afficher le loading seulement si on n'a pas de données du loader
  if (isLoading && loaderIllustrations.length === 0) {
    console.info("🔍 [AdminIllustrations] Affichage du loading");
    return (
      <main className="admin-illustrations-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des illustrations...</p>
        </section>
      </main>
    );
  }

  // ✅ Afficher l'erreur seulement si on n'a pas de données du loader
  if (error && loaderIllustrations.length === 0) {
    console.info("🔍 [AdminIllustrations] Affichage de l'erreur:", error);
    return (
      <main className="admin-illustrations-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des illustrations.</p>
        </section>
      </main>
    );
  }

  console.info(
    "🔍 [AdminIllustrations] Rendu de la page avec",
    currentIllustrations.length,
    "illustrations",
  );

  return (
    <main className="admin-illustrations-page">
      {/* Header avec bouton - affiché seulement si le formulaire n'est pas visible */}
      {!showForm && (
        <header className="admin-page-header">
          <h1>Gestion des Illustrations</h1>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="admin-new-illustration-btn"
          >
            Nouvelle Illustration
          </button>
        </header>
      )}

      {/* Formulaire - affiché seulement si showForm est true */}
      {showForm && (
        <section className="admin-form-section">
          <header className="admin-form-header">
            <h1>
              {editingIllustration
                ? "Modifier l'illustration"
                : "Nouvelle Illustration"}
            </h1>
          </header>
          <AdminIllustrationForm
            formData={formData}
            setFormData={setFormData}
            tags={currentTags}
            onSubmit={editingIllustration ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!editingIllustration}
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

          <section className="admin-illustrations-grid">
            {currentIllustrations.length === 0 ? (
              <p>Aucune illustration trouvée</p>
            ) : (
              currentIllustrations.map((illustration: AdminIllustration) => {
                console.info(
                  "🔍 [AdminIllustrations] Rendu de l'illustration:",
                  illustration.id,
                  illustration.title,
                );
                return (
                  <AdminIllustrationCard
                    key={illustration.id}
                    illustration={illustration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                );
              })
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default AdminIllustrations;
