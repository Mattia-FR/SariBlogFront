import { useState } from "react";
import { useAdminUsers } from "../../../hooks/useAdminUsers";
import { usePagination } from "../../../hooks/usePagination";
import type { AdminUser, CreateUserData } from "../../../types/admin";
import AdminUserCard from "../../molecules/AdminUserCard";
import AdminUserForm from "../../molecules/AdminuserForm";
import Pagination from "../../molecules/Pagination";

function AdminUsers() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    username: "",
    email: "",
    password: "",
    role: "editor",
  });

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination(12);

  // Hook SWR
  const {
    users,
    pagination,
    stats,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleActive,
  } = useAdminUsers(limit, offset);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "editor",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur création utilisateur:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser(editingUser, formData);
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "editor",
      });
    } catch (error) {
      console.error("Erreur modification utilisateur:", error);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "", // Ne pas pré-remplir le mot de passe
      role: user.role,
    });
    setEditingUser(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error("Erreur suppression utilisateur:", error);
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleActive(id);
    } catch (error) {
      console.error("Erreur changement statut:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "editor",
    });
  };

  if (isLoading) {
    return (
      <main className="admin-users-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des utilisateurs...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-users-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des utilisateurs.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-users-page">
      <header className="admin-page-header">
        <h1>Gestion des Utilisateurs</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="admin-button primary"
        >
          Nouvel Utilisateur
        </button>
      </header>

      {stats && (
        <section className="admin-users-stats">
          <article className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </article>
          <article className="stat-item active">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Actifs</span>
          </article>
          <article className="stat-item inactive">
            <span className="stat-number">{stats.inactive}</span>
            <span className="stat-label">Inactifs</span>
          </article>
          <article className="stat-item">
            <span className="stat-number">{stats.by_role.admin}</span>
            <span className="stat-label">Admins</span>
          </article>
          <article className="stat-item">
            <span className="stat-number">{stats.by_role.editor}</span>
            <span className="stat-label">Éditeurs</span>
          </article>
        </section>
      )}

      {showForm && (
        <AdminUserForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          isEditing={!!editingUser}
        />
      )}

      <section className="admin-users-grid">
        {users.map((user) => (
          <AdminUserCard
            key={user.id}
            user={user}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
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

export default AdminUsers;
