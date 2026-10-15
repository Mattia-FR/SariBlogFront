import { toast } from "react-toastify";
import { getErrorMessage, isApiError } from "./apiError";
import { logger } from "./logger";

// Point unique d'affichage d'une erreur dans un `catch` : toast + log en DEV.
// Retourne le message (pour un éventuel état local `error`).
export function notifyError(err: unknown, fallback: string): string {
  logger.error(err);
  const message = getErrorMessage(err, fallback);
  // Un 401 est déjà signalé une seule fois par AuthContext (« Session expirée ») avant la redirection.
  if (!(isApiError(err) && err.statusCode === 401)) {
    toast.error(message);
  }
  return message;
}
