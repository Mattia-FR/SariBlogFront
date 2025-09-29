import { createContext, type ReactNode, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import type { AuthState } from "../types/auth";

type AuthContextType = AuthState & {
  login: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    error?: { code: string; message: string };
  }>;
  logout: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
