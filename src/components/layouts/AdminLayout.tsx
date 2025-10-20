import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import AdminSidebar from "../molecules/AdminSidebar";

export default function AdminLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <main className="admin-layout-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <section className="admin-layout-main">
        <main className="admin-layout-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
