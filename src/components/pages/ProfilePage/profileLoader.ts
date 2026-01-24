import type { User } from "../../../types/users";
import { api } from "../../../utils/apiClient";
import type { ProfileLoaderData } from "./profileTypes";

export async function profileLoader(): Promise<ProfileLoaderData> {
  const user = await api.get<User>("/users/me");
  return { user };
}
