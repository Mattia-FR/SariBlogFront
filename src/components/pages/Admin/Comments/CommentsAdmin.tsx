import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Comment, CommentStatus } from "../../../../types/comment";
import { api } from "../../../../utils/apiClient";
import CommentCard from "../../../molecules/CommentCard";

function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | "">("");

  const fetchComments = useCallback(async () => {
    try {
      const data = await api.get<Comment[]>("/admin/comments");
      setComments(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const allStatuses = Array.from(
    new Set(comments.map((c) => c.status).filter(Boolean)),
  ) as CommentStatus[];

  let filteredComments: Comment[];
  if (selectedStatus === "") {
    filteredComments = comments;
  } else {
    filteredComments = comments.filter((c) => c.status === selectedStatus);
  }

  if (loading) return <p>Chargement des commentaires…</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="admin-comments">
      <h2>Gestion des commentaires</h2>

      <div>
        <button onClick={() => setSelectedStatus("")} type="button">
          Tous ({comments.length})
        </button>

        {allStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            type="button"
          >
            {status} ({comments.filter((m) => m.status === status).length})
          </button>
        ))}
      </div>

      {selectedStatus !== "" && (
        <div>
          <p>Filtré par : {selectedStatus}</p>
          <button type="button" onClick={() => setSelectedStatus("")}>
            × Effacer le filtre
          </button>
        </div>
      )}

      <section className="comments-list">
        {filteredComments.map((comment) => (
          <div key={comment.id}>
            <CommentCard comment={comment} showStatus />
            <div>
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
    </main>
  );
}

export default CommentsAdmin;
