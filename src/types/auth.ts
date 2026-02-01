import type { User } from "./users";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  firstname?: string | null;
  lastname?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
}
