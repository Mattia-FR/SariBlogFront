import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type PublicNavLinksProps = {
  onNavigate?: () => void;
};

const links = [
  { to: "/", label: "Accueil" },
  { to: "/gallery", label: "Galerie" },
  { to: "/blog", label: "Blog" },
  { to: "/presentation", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

function PublicNavLinks({ onNavigate }: PublicNavLinksProps) {
  const { user } = useAuth();
  const isAdminAuthorized =
    !!user && (user.role === "admin" || user.role === "editor");

  return (
    <>
      {links.map(({ to, label }) => (
        <NavLink key={to} to={to} onClick={onNavigate}>
          <p>{label}</p>
        </NavLink>
      ))}
      {isAdminAuthorized && (
        <NavLink to="/admin" onClick={onNavigate}>
          <p>Admin</p>
        </NavLink>
      )}
    </>
  );
}

export default PublicNavLinks;
