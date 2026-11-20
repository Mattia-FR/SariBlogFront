import type { LoaderFunctionArgs } from "react-router-dom";
import type { User } from "../../../types/users";
import { loaderFetch } from "../../../utils/loaderFetch";
import type { PresentationLoaderData } from "./presentationTypes";

export async function presentationLoader({
  request,
}: LoaderFunctionArgs): Promise<PresentationLoaderData> {
  const user = await loaderFetch<User>("/users/artist", request.signal);
  return { user };
}
