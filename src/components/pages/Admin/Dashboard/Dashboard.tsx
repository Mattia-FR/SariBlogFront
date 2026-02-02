import { NavLink } from "react-router-dom";

function Dashboard() {
  return (
    <main>
      <h2>Bienvenue, Admin !</h2>
      <section>
        <NavLink to="/admin/articles">Gérer les articles</NavLink>
        <NavLink to="/admin/messages">Voir les messages</NavLink>
        <NavLink to="/admin/images">Gérer la galerie</NavLink>
      </section>
    </main>
  );
}

export default Dashboard;
