import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("libraryUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (_error) {
      localStorage.removeItem("libraryUser");
      localStorage.removeItem("libraryToken");
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("libraryToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("libraryUser", JSON.stringify(data.user));
      } catch (_error) {
        localStorage.removeItem("libraryToken");
        localStorage.removeItem("libraryUser");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const saveSession = (data) => {
    localStorage.setItem("libraryToken", data.token);
    localStorage.setItem("libraryUser", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    saveSession(data);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    saveSession(data);
  };

  const socialLogin = async (payload) => {
    const { data } = await api.post("/auth/social-login", payload);
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem("libraryToken");
    localStorage.removeItem("libraryUser");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isStaff: user?.role === "admin" || user?.role === "librarian",
      login,
      register,
      socialLogin,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

