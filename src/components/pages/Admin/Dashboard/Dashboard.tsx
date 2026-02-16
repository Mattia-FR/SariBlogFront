import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../../utils/apiClient";

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
        console.error("Erreur chargement stats:", err);
        setError("Impossible de charger les statistiques");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <main>
        <p>Chargement des statistiques...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Tableau de bord</h1>

      <section className="dashboard-actions">
        <h2>Actions rapides</h2>
        <Link to="/admin/articles">📰 Gérer les articles</Link>
        <Link to="/admin/messages">📧 Voir les messages</Link>
        <Link to="/admin/images">🖼️ Gérer la galerie</Link>
      </section>

      {stats && (
        <section className="dashboard-stats">
          <div className="stat-card">
            <h2>📰 Articles</h2>
            <p>Total : {stats.articles.total}</p>
            <p>Publiés : {stats.articles.published}</p>
            <p>Brouillons : {stats.articles.drafts}</p>
          </div>

          <div className="stat-card">
            <h2>🖼️ Images</h2>
            <p>Total : {stats.images.total}</p>
            <p>En galerie : {stats.images.inGallery}</p>
          </div>

          <div className="stat-card">
            <h2>🏷️ Tags</h2>
            <p>Total : {stats.tags.total}</p>
          </div>

          <div className="stat-card">
            <h2>📧 Messages</h2>
            <p className="highlight">Non lus : {stats.messages.unread}</p>
            <p>Lus : {stats.messages.read}</p>
            <p>Archivés : {stats.messages.archived}</p>
          </div>
        </section>
      )}
    </main>
  );
}

export default Dashboard;
