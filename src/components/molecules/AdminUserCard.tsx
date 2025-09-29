import {
  Edit,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import React from "react";
import type { AdminUser } from "../../types/admin";

type AdminUserCardProps = {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
};

function AdminUserCard({
  user,
  onEdit,
  onDelete,
  onToggleActive,
}: AdminUserCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleIcon = (role: string) => {
    return role === "admin" ? ShieldCheck : Shield;
  };

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "Administrateur" : "Éditeur";
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <article className="admin-user-card">
      <header className="admin-user-header">
        <figure className="admin-user-avatar">
          <span className="avatar-text">{getInitials(user.username)}</span>
        </figure>
        <section className="admin-user-info">
          <h3 className="admin-user-name">{user.username}</h3>
          <p className="admin-user-email">{user.email}</p>
        </section>
        <section
          className={`admin-user-status ${user.is_active ? "active" : "inactive"}`}
        >
          {user.is_active ? (
            <UserCheck size={16} className="status-icon" />
          ) : (
            <UserX size={16} className="status-icon" />
          )}
          <span className="status-text">
            {user.is_active ? "Actif" : "Inactif"}
          </span>
        </section>
      </header>

      <section className="admin-user-details">
        <section className="admin-user-role">
          {React.createElement(getRoleIcon(user.role), { size: 16 })}
          <span>{getRoleLabel(user.role)}</span>
        </section>
        <p className="admin-user-meta">
          Dernière connexion : {formatDate(user.last_login)}
        </p>
        <p className="admin-user-meta">Créé le {formatDate(user.created_at)}</p>
      </section>

      <nav className="admin-user-actions">
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="admin-button secondary"
          title="Modifier l'utilisateur"
        >
          <Edit size={16} />
          Modifier
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(user.id)}
          className={`admin-button toggle ${user.is_active ? "deactivate" : "activate"}`}
          title={user.is_active ? "Désactiver" : "Activer"}
        >
          {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
          {user.is_active ? "Désactiver" : "Activer"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(user.id)}
          className="admin-button danger"
          title="Supprimer l'utilisateur"
        >
          <Trash2 size={16} />
          Supprimer
        </button>
      </nav>
    </article>
  );
}

export default AdminUserCard;
