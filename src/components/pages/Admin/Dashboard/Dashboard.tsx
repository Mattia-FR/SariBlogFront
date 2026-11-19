import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../../utils/apiClient";
import { notifyError } from "../../../../utils/notifyError";
import "./Dashboard.css";

interface DashboardStats {
  articles: {
    total: number;
    published: number;
    drafts: number;
  };
  images: {
    total: number;
    inGallery: number;
  };
  tags: {
    total: number;
  };
  messages: {
    unread: number;
    read: number;
    archived: number;
  };
}

const quickActions = [
  { to: "/admin/profile", label: "Profil" },
  { to: "/admin/articles", label: "Articles" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/images", label: "Galerie" },
  { to: "/admin/comments", label: "Commentaires" },
  { to: "/admin/tags", label: "Tags" },
  { to: "/admin/categories", label: "Catégories" },
] as const;

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<DashboardStats>("/admin/dashboard/stats");
        setStats(data);
      } catch (err) {
        setError(notifyError(err, "Impossible de charger les statistiques"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <section className="dashboard">
        <header className="dashboard-header">
          <div className="dashboard-heading">
            <p className="dashboard-kicker">Administration</p>
            <h1 className="dashboard-title">Tableau de bord</h1>
          </div>
        </header>
        <p className="dashboard-loading">Chargement des statistiques…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard">
        <header className="dashboard-header">
          <div className="dashboard-heading">
            <p className="dashboard-kicker">Administration</p>
            <h1 className="dashboard-title">Tableau de bord</h1>
          </div>
        </header>
        <p className="dashboard-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <p className="dashboard-kicker">Administration</p>
          <h1 className="dashboard-title">Tableau de bord</h1>
        </div>
      </header>

      <section className="dashboard-actions">
        <h2 className="dashboard-section-title">Actions rapides</h2>
        <div className="dashboard-nav">
          {quickActions.map(({ to, label }) => (
            <Link key={to} to={to} className="dashboard-nav-card">
              <span className="dashboard-nav-card-name">{label}</span>
              <span className="dashboard-nav-card-cta">Ouvrir →</span>
            </Link>
          ))}
        </div>
      </section>

      {stats && (
        <section className="dashboard-stats">
          <h2 className="dashboard-section-title">Statistiques</h2>
          <div className="dashboard-stats-grid">
            <div className="stat-card">
              <h3 className="stat-card-title">Articles</h3>
              <p className="stat-card-row">Total : {stats.articles.total}</p>
              <p className="stat-card-row">
                Publiés : {stats.articles.published}
              </p>
              <p className="stat-card-row">
                Brouillons : {stats.articles.drafts}
              </p>
            </div>

            <div className="stat-card">
              <h3 className="stat-card-title">Images</h3>
              <p className="stat-card-row">Total : {stats.images.total}</p>
              <p className="stat-card-row">
                En galerie : {stats.images.inGallery}
              </p>
            </div>

            <div className="stat-card">
              <h3 className="stat-card-title">Tags</h3>
              <p className="stat-card-row">Total : {stats.tags.total}</p>
            </div>

            <div className="stat-card">
              <h3 className="stat-card-title">Messages</h3>
              <p className="stat-card-row stat-card-highlight">
                Non lus : {stats.messages.unread}
              </p>
              <p className="stat-card-row">Lus : {stats.messages.read}</p>
              <p className="stat-card-row">
                Archivés : {stats.messages.archived}
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

export default Dashboard;
