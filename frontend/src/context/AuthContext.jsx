import React, { createContext, useState, useEffect, useContext } from "react";
import api from "@/services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("insurly_token");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          const userData = res.data.data;
          // Restore role from localStorage if API doesn't include it
          const savedRole = localStorage.getItem("insurly_role");
          if (userData && !userData.role && savedRole) {
            userData.role = savedRole;
          }
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem("insurly_token");
          localStorage.removeItem("insurly_role");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password, role = "worker") => {
    const endpoint = role === "admin" ? "/auth/admin/login" : "/auth/login";
    const res = await api.post(endpoint, { email, password });

    const token = res.data.token || res.data.data?.token;
    localStorage.setItem("insurly_token", token);
    localStorage.setItem("insurly_role", role);
    const userData = res.data.data?.worker || res.data.data || {};
    setUser({ ...userData, role });
    setIsAuthenticated(true);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    const token = res.data.token || res.data.data?.token;
    localStorage.setItem("insurly_token", token);
    localStorage.setItem("insurly_role", "worker");
    const regUserData = res.data.data?.worker || res.data.data || {};
    setUser({ ...regUserData, role: "worker" });
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("insurly_token");
    localStorage.removeItem("insurly_role");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
