import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { Comment, CommentStatus } from "../../../../types/comment";
import { api } from "../../../../utils/apiClient";
import CommentCard from "../../../molecules/CommentCard";
import NavigationPagination from "../../../molecules/NavigationPagination";
import "./CommentsAdmin.css";

const STATUSES: CommentStatus[] = ["pending", "approved", "rejected", "spam"];

const STATUS_LABELS: Record<CommentStatus, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Refusé",
  spam: "Spam",
};

type CommentsListResponse = {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    spam: number;
  };
};

function CommentsAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const statusParam = searchParams.get("status");

  let statusFilter: CommentStatus | null = null;
  if (
    statusParam != null &&
    statusParam !== "" &&
    STATUSES.includes(statusParam as CommentStatus)
  ) {
    statusFilter = statusParam as CommentStatus;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [counts, setCounts] = useState<CommentsListResponse["counts"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      statusParam != null &&
      statusParam !== "" &&
      !STATUSES.includes(statusParam as CommentStatus)
    ) {
      const next = new URLSearchParams(searchParams);
      next.delete("status");
      setSearchParams(next, { replace: true });
    }
  }, [statusParam, searchParams, setSearchParams]);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ page: String(page) });
      if (statusFilter != null) {
        q.set("status", statusFilter);
      }
      const data = await api.get<CommentsListResponse>(
        `/admin/comments?${q.toString()}`,
      );
      setComments(data.comments);
      setTotalPages(Math.ceil(data.total / data.limit));
      setCounts(data.counts);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleStatusChange(commentId: number, status: CommentStatus) {
    try {
      await api.patch(`/admin/comments/${commentId}/status`, { status });
      await fetchComments();
      toast.success("Statut mis à jour");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  }

  async function handleDelete(commentId: number) {
    try {
      await api.delete(`/admin/comments/${commentId}`);
      await fetchComments();
      toast.success("Commentaire supprimé");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  }

  function setStatusTab(nextStatus: CommentStatus | null) {
    const next = new URLSearchParams(searchParams);
    if (nextStatus == null) {
      next.delete("status");
    } else {
      next.set("status", nextStatus);
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  if (loading) return <p>Chargement des commentaires…</p>;
  if (error) return <p>{error}</p>;

  const c = counts ?? {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0,
  };

  return (
    <main className="comments-admin">
      <h2 className="comments-admin-title">Gestion des commentaires</h2>

      <div className="comments-admin-filters">
        <button
          className={statusFilter === null ? "active" : ""}
          onClick={() => setStatusTab(null)}
          type="button"
        >
          Tous ({c.total})
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            className={statusFilter === status ? "active" : ""}
            onClick={() => setStatusTab(status)}
            type="button"
          >
            {STATUS_LABELS[status]} ({c[status]})
          </button>
        ))}
      </div>

      {statusFilter !== null && (
        <div className="comments-admin-filter-active">
          <p>Filtré par : {STATUS_LABELS[statusFilter]}</p>
          <button type="button" onClick={() => setStatusTab(null)}>
            × Effacer le filtre
          </button>
        </div>
      )}

      {comments.length === 0 ? (
        <p>Aucun commentaire</p>
      ) : (
        <section className="comments-admin-grid">
          {comments.map((comment) => (
            <div key={comment.id} className="comments-admin-item">
              <CommentCard comment={comment} showStatus />

              <div className="comments-admin-item-buttons">
                {comment.status !== "pending" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(comment.id, "pending")}
                  >
                    En attente
                  </button>
                )}

                {comment.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(comment.id, "approved")}
                  >
                    Approuver
                  </button>
                )}

                {comment.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(comment.id, "rejected")}
                  >
                    Refuser
                  </button>
                )}

                {comment.status !== "spam" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(comment.id, "spam")}
                  >
                    Spam
                  </button>
                )}

                <button type="button" onClick={() => handleDelete(comment.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      <NavigationPagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/comments"
        searchParams={searchParams}
      />
    </main>
  );
}

export default CommentsAdmin;
