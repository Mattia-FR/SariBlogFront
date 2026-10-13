// Erreur levée par `api.*` quand le serveur répond avec un statut non-OK.
// Miroir du `HttpError` du back (mêmes noms : statusCode, code).
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
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
