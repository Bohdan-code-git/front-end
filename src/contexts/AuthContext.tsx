import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/user";
import { apiClient } from "@/lib/api";

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const currentUser = await apiClient.get<User>("/auth/me");
          setUser(currentUser);
        } catch (error) {
          apiClient.clearAuthToken();
          localStorage.removeItem("currentUser");
        }
      }
      setIsLoading(false);
    };

    loadUser();

    const handleUnauthorized = () => {
      setUser(null);
      apiClient.clearAuthToken();
      localStorage.removeItem("currentUser");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      apiClient.setAuthToken(response.token);
      setUser(response.user);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", {
        email,
        password,
        name,
        phone,
      });

      apiClient.setAuthToken(response.token);
      setUser(response.user);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      apiClient.clearAuthToken();
      localStorage.removeItem("currentUser");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
