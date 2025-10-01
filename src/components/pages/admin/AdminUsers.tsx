import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useAdminUserStats, useAdminUsers } from "../../../hooks/useAdminUsers";
import { usePagination } from "../../../hooks/usePagination";
import type {
  AdminUser,
  AdminUsersPageData,
  CreateUserData,
} from "../../../types/admin";
import AdminUserCard from "../../molecules/AdminUserCard";
import AdminUserForm from "../../molecules/AdminuserForm";
import Pagination from "../../molecules/Pagination";

function AdminUsers() {
  // ✅ Ajouter useLoaderData
  const loaderData = useLoaderData() as AdminUsersPageData;
  const {
    users: loaderUsers,
    pagination: loaderPagination,
    stats: loaderStats,
  } = loaderData;

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

  // ✅ Hook SWR avec fallback
  const {
    users: swrUsers,
    pagination: swrPagination,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleActive,
  } = useAdminUsers(limit, offset);

  // ✅ Hook séparé pour les stats
  const { stats: swrStats } = useAdminUserStats();

  // ✅ Utiliser les données SWR ou fallback vers le loader
  const users = swrUsers.length > 0 ? swrUsers : loaderUsers;
  const pagination = swrPagination || loaderPagination;
  const stats = swrStats || loaderStats;

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

  // ✅ Corriger la signature pour correspondre à AdminUserCard
  const handleToggleActive = async (id: number) => {
    try {
      // Trouver l'utilisateur pour obtenir son statut actuel
      const user = users.find((u) => u.id === id);
      if (user) {
        await toggleActive(id, !user.is_active); // ✅ Inverser le statut actuel
      }
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

  // ✅ Afficher le loading seulement si on n'a pas de données du loader
  if (isLoading && loaderUsers.length === 0) {
    return (
      <main className="admin-users-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des utilisateurs...</p>
        </section>
      </main>
    );
  }

  // ✅ Afficher l'erreur seulement si on n'a pas de données du loader
  if (error && loaderUsers.length === 0) {
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
            <span className="stat-number">{stats.total || 0}</span>
            <span className="stat-label">Total</span>
          </article>
          <article className="stat-item active">
            <span className="stat-number">{stats.active || 0}</span>
            <span className="stat-label">Actifs</span>
          </article>
          <article className="stat-item inactive">
            <span className="stat-number">{stats.inactive || 0}</span>
            <span className="stat-label">Inactifs</span>
          </article>
          <article className="stat-item">
            <span className="stat-number">{stats.by_role?.admin || 0}</span>{" "}
            {/* ✅ Ajouter ?. pour éviter l'erreur */}
            <span className="stat-label">Admins</span>
          </article>
          <article className="stat-item">
            <span className="stat-number">{stats.by_role?.editor || 0}</span>{" "}
            {/* ✅ Ajouter ?. pour éviter l'erreur */}
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
