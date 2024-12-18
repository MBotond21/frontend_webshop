import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType } from '../types/auth';
import { useNavigate } from 'react-router';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  validate: () => {},
  logout: () => {},
  update: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token && !isLoggedOut) {
        try {
          const response = await fetch("http://localhost:3000/users", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Token validation failed");

          const data = await response.json();
          setUser({
            id: data.id,
            userName: data.userName,
            email: data.email,
            token,
          });
        } catch (error) {
          console.error("Validation error:", error);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }
    };

    loadToken();
  }, [isLoggedOut]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      setUser({ id: data.userId, token: data.token });
      localStorage.setItem("authToken", data.token);

      await validate();

      navigate("/account");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  let isValidating = false;

  const validate = async () => {
    if (isLoggedOut || isValidating) return;
    isValidating = true;
  
    try {
      const token = user?.token || localStorage.getItem("authToken");
      if (!token) return;
  
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Validation failed");
  
      const data = await response.json();
      setUser({
        id: data.id,
        userName: data.userName,
        email: data.email,
        token,
      });
    } catch (error) {
      console.error("Validation error:", error);
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      isValidating = false;
    }
  };

  const logout = useCallback(() => {
    console.log("logging out...");
    setIsLoggedOut(true);
    setUser(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  }, [navigate]);

  const update = async (id: number, userName?: string, password?: string) => {

  }

  return (
    <AuthContext.Provider value={{ user, login, validate, logout, update }}>
      {children}
    </AuthContext.Provider>
  );
};