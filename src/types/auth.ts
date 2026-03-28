import type { User } from "./users";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}
