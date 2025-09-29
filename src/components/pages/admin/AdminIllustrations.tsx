import { useState } from "react";
import {
  useAdminIllustrations,
  useAdminIllustrationTags,
} from "../../../hooks/useAdminIllustrations";
import { usePagination } from "../../../hooks/usePagination";
import type {
  AdminIllustration,
  AdminTag,
  CreateIllustrationData,
} from "../../../types/admin";
import AdminIllustrationCard from "../../molecules/AdminIllustrationCard";
import AdminIllustrationForm from "../../molecules/AdminIllustrationForm";
import Pagination from "../../molecules/Pagination";

function AdminIllustrations() {
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

  // Hooks SWR
  const {
    illustrations,
    pagination,
    isLoading,
    error,
    createIllustration,
    updateIllustration,
    deleteIllustration,
  } = useAdminIllustrations(limit, offset);

  const { tags } = useAdminIllustrationTags();

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

  if (isLoading) {
    return (
      <main className="admin-illustrations-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des illustrations...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-illustrations-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des illustrations.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-illustrations-page">
      <header className="admin-page-header">
        <h1>Gestion des Illustrations</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="admin-button primary"
        >
          Nouvelle Illustration
        </button>
      </header>

      {showForm && (
        <AdminIllustrationForm
          formData={formData}
          setFormData={setFormData}
          tags={tags}
          onSubmit={editingIllustration ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          isEditing={!!editingIllustration}
        />
      )}

      <section className="admin-illustrations-grid">
        {illustrations.map((illustration) => (
          <AdminIllustrationCard
            key={illustration.id}
            illustration={illustration}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </section>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => handlePageChange(page, pagination)}
        />
      )}
    </main>
  );
}

export default AdminIllustrations;
