export type User = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "editor";
  is_active: boolean;
  last_login: string;
  created_at: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
  message: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthError = {
  code: string;
  message: string;
};
