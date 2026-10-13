// Contrat d'erreur de l'API : { error: string, code: ErrorCode, details?: ZodIssue[] }.
// Miroir de `Back/src/utils/httpErrors.ts` (+ NETWORK_ERROR, propre au front).
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_JSON"
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "ROUTE_NOT_FOUND"
  | "CONFLICT"
  | "INVALID_REFERENCE"
  | "RATE_LIMITED"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"
  | "INTERNAL_ERROR"
  | "ARTICLE_SLUG_TAKEN"
  | "TAG_TAKEN"
  | "CATEGORY_TAKEN"
  | "USER_IDENTIFIER_TAKEN"
  | "NETWORK_ERROR";

export const NETWORK_ERROR_MESSAGE =
  "Serveur injoignable. Vérifiez votre connexion puis réessayez.";

// Erreur levée par `api.*` quand le serveur répond avec un statut non-OK,
// ou quand il est injoignable (statusCode 0, code NETWORK_ERROR).
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code?: ErrorCode;
  readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code?: ErrorCode,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

// Message à afficher à l'utilisateur : celui du backend (ou de l'Error), sinon le repli.
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

// Mappe `details` Zod (`err.issues`) vers Record champ → message (1er message par champ).
export function fieldErrorsFromApiDetails(
  details: unknown,
): Record<string, string> | null {
  if (!Array.isArray(details)) return null;
  const errors: Record<string, string> = {};
  for (const issue of details) {
    if (
      issue &&
      typeof issue === "object" &&
      "path" in issue &&
      "message" in issue &&
      Array.isArray((issue as { path: unknown }).path) &&
      typeof (issue as { message: unknown }).message === "string"
    ) {
      const path = (issue as { path: unknown[] }).path;
      const field = path[0];
      if (typeof field === "string" && !(field in errors)) {
        errors[field] = (issue as { message: string }).message;
      }
    }
  }
  return Object.keys(errors).length > 0 ? errors : null;
}
