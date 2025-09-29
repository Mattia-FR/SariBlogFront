import { useState } from "react";
import { useAdminTags } from "../../../hooks/useAdminTags";
import { usePagination } from "../../../hooks/usePagination";
import type { AdminTag, CreateTagData } from "../../../types/admin";
import AdminTagCard from "../../molecules/AdminTagCard";
import AdminTagForm from "../../molecules/AdminTagForm";
import Pagination from "../../molecules/Pagination";

function AdminTags() {
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateTagData>({
    name: "",
  });

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination(12);

  // Hook SWR
  const {
    tags,
    pagination,
    stats,
    isLoading,
    error,
    createTag,
    updateTag,
    deleteTag,
  } = useAdminTags(limit, offset);

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

  if (isLoading) {
    return (
      <main className="admin-tags-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des tags...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-tags-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des tags.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-tags-page">
      <header className="admin-page-header">
        <h1>Gestion des Tags</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="admin-button primary"
        >
          Nouveau Tag
        </button>
      </header>

      {stats && (
        <section className="admin-tags-stats">
          <article className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </article>
          <article className="stat-item">
            <span className="stat-number">{stats.most_used.length}</span>
            <span className="stat-label">Plus utilisés</span>
          </article>
        </section>
      )}

      {showForm && (
        <AdminTagForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={editingTag ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          isEditing={!!editingTag}
        />
      )}

      <section className="admin-tags-grid">
        {tags.map((tag) => (
          <AdminTagCard
            key={tag.id}
            tag={tag}
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

export default AdminTags;
