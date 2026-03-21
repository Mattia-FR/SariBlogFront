import { NavLink } from "react-router-dom";

type AdminNavLinksProps = {
  onNavigate?: () => void;
};

const links = [
  { to: "/admin", label: "Tableau de bord" },
  { to: "/admin/articles", label: "Articles" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/images", label: "Galerie" },
  { to: "/admin/comments", label: "Commentaires" },
  { to: "/admin/tags", label: "Tags" },
  { to: "/admin/categories", label: "Catégories" },
  { to: "/admin/profile", label: "Profil" },
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
