import type { User } from "../../../types/users";
import { loaderFetch } from "../../../utils/loaderFetch";
import type { PresentationLoaderData } from "./presentationTypes";

export async function presentationLoader(): Promise<PresentationLoaderData> {
  const user = await loaderFetch<User>("/users/artist");
  return { user };
}
