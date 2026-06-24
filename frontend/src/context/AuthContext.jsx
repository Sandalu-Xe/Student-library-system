import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("libraryUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // On mount, verify the stored token is still valid
  useEffect(() => {
    const token = localStorage.getItem("libraryToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("libraryUser", JSON.stringify(data.user));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("libraryToken");
        localStorage.removeItem("libraryUser");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("libraryToken", data.token);
    localStorage.setItem("libraryUser", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, role, studentId) => {
    const { data } = await api.post("/auth/register", { name, email, password, role, studentId });
    localStorage.setItem("libraryToken", data.token);
    localStorage.setItem("libraryUser", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
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
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
