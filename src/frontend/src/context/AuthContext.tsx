import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AdminInfo, backendInterface as AuthBackend } from "../backend.d";
import { useActor } from "../hooks/useActor";

const SESSION_KEY = "adminSession";

// Cast actor to the auth-capable backend interface
function asAuthBackend(actor: unknown): AuthBackend {
  return actor as AuthBackend;
}

interface AuthState {
  token: string | null;
  admin: AdminInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  navigate: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();
  const [state, setState] = useState<AuthState>({
    token: null,
    admin: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const navigate = useCallback((path: string) => {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  // Validate stored session on mount
  useEffect(() => {
    if (isFetching) return;
    if (!actor) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const storedToken = sessionStorage.getItem(SESSION_KEY);
    if (!storedToken) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const authActor = asAuthBackend(actor);
    authActor
      .checkSession(storedToken)
      .then((result) => {
        if ("ok" in result) {
          setState({
            token: storedToken,
            admin: result.ok,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          sessionStorage.removeItem(SESSION_KEY);
          setState({
            token: null,
            admin: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      })
      .catch(() => {
        sessionStorage.removeItem(SESSION_KEY);
        setState({
          token: null,
          admin: null,
          isLoading: false,
          isAuthenticated: false,
        });
      });
  }, [actor, isFetching]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      if (!actor)
        return { error: "System not ready. Please refresh and try again." };

      try {
        const authActor = asAuthBackend(actor);
        const result = await authActor.adminLogin(email, password, "web");
        if ("ok" in result) {
          const { token, admin } = result.ok;
          // Store ONLY in sessionStorage — not localStorage, not URL
          sessionStorage.setItem(SESSION_KEY, token);
          setState({ token, admin, isLoading: false, isAuthenticated: true });
          return {};
        }
        return { error: result.err };
      } catch {
        return {
          error: "Login failed. Please check your credentials and try again.",
        };
      }
    },
    [actor],
  );

  const logout = useCallback(async () => {
    const token = sessionStorage.getItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setState({
      token: null,
      admin: null,
      isLoading: false,
      isAuthenticated: false,
    });
    if (actor && token) {
      const authActor = asAuthBackend(actor);
      authActor.adminLogout(token).catch(() => {});
    }
    navigate("/login");
  }, [actor, navigate]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, navigate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
