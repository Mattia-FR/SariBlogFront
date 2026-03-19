import { NavLink } from "react-router-dom";

type AdminNavLinksProps = {
  onNavigate?: () => void;
};

const links = [
  { to: "/admin", label: "Tableau de bord" },
  { to: "/admin/profile", label: "Mon profil" },
  { to: "/admin/articles", label: "Gérer les articles" },
  { to: "/admin/messages", label: "Voir les messages" },
  { to: "/admin/images", label: "Gérer la galerie" },
  { to: "/admin/comments", label: "Gérer les commentaires" },
  { to: "/admin/tags", label: "Gérer les tags" },
  { to: "/admin/categories", label: "Gérer les catégories" },
];

function AdminNavLinks({ onNavigate }: AdminNavLinksProps) {
  return (
    <>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          // Par défaut `NavLink` considère un match "startsWith", donc `/admin`
          // serait actif sur toutes les routes `/admin/*`. On force un match
          // exact uniquement pour le tableau de bord.
          end={to === "/admin"}
          onClick={onNavigate}
        >
          <p>{label}</p>
        </NavLink>
      ))}
    </>
  );
}

export default AdminNavLinks;
