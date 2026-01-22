export interface User {
  id: number;
  username: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  role: "admin" | "editor" | "subscriber";
  avatar: string | null;
  bio: string | null;
  bio_short: string | null;
  created_at: Date;
  updated_at: Date;
}

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

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}
