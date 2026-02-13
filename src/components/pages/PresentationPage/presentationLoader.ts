import type { User } from "../../../types/users";
import { api } from "../../../utils/apiClient";
import type { PresentationLoaderData } from "./presentationTypes";

export async function presentationLoader(): Promise<PresentationLoaderData> {
  const user = await api.get<User>("/users/artist");
  return { user };
}
