import { FileText, Image, LogOut, Mail, Settings, Tag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

import "./AdminSidebar.css";

export default function AdminSidebar() {
  const { logout, user } = useAuthContext();

  const menuItems = [
    { path: "/admin/articles", label: "Articles", icon: FileText },
    { path: "/admin/illustrations", label: "Illustrations", icon: Image },
    { path: "/admin/messages", label: "Messages", icon: Mail },
    { path: "/admin/tags", label: "Tags", icon: Tag },
    { path: "/admin/about", label: "À propos", icon: Settings },
  ];

  return (
    <aside className="admin-sidebar">
      <header className="admin-sidebar-header">
        <h2>Administration</h2>
      </header>

      <section className="admin-sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </section>

      <footer className="admin-sidebar-footer">
        <section className="admin-sidebar-user">
          <p>Connecté en tant que</p>
          <strong>{user?.username}</strong>
        </section>
        <button type="button" onClick={logout} className="admin-sidebar-logout">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </footer>
    </aside>
  );
}
