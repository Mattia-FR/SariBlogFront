import { NavLink } from "react-router-dom";

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
  return (
    <>
      {links.map(({ to, label }) => (
        <NavLink key={to} to={to} onClick={onNavigate}>
          <p>{label}</p>
        </NavLink>
      ))}
    </>
  );
}

export default PublicNavLinks;
