import { useEffect } from "react";
import {
  isRouteErrorResponse,
  useRevalidator,
  useRouteError,
} from "react-router-dom";
import { logger } from "../../../utils/logger";
import ErrorView from "../../molecules/ErrorView";

// errorElement React Router : erreurs de loader (Response levée par loaderFetch) et de rendu.
export function ErrorPage() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  useEffect(() => {
    logger.error("[ErrorPage]", error);
  }, [error]);

  const status = isRouteErrorResponse(error) ? error.status : null;
  let detail: string | undefined;
  if (isRouteErrorResponse(error)) {
    detail = typeof error.data === "string" ? error.data : error.statusText;
  } else if (error instanceof Error) {
    detail = error.stack ?? error.message;
  }

  return (
    <ErrorView
      status={status}
      detail={detail}
      onRetry={() => revalidator.revalidate()}
    />
  );
}
