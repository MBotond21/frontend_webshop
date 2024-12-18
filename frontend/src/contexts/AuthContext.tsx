import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType } from '../types/auth';
import { useNavigate } from 'react-router';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  validate: async (): Promise<boolean> => { return false },
  logout: () => {},
  update: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
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

    loadUserData();
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

      window.location.reload();
      navigate("/account");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  const validate = async () => {
    const isValidating = sessionStorage.getItem("isValidating");
    if (isValidating === "true") {
      console.log("Validation already in progress.");
      return false;
    }

    sessionStorage.setItem("isValidating", "true");

    try {
      const token = user?.token || localStorage.getItem("authToken");
      if (!token) {
        console.log("No token found.");
        return false;
      }

      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Token validation failed");

      const data = await response.json();
      await setUser({
        id: data.id,
        userName: data.userName,
        email: data.email,
        token,
      });

      return true;
    } catch (error) {
      console.error("Validation error:", error);
      await setUser(null);
      //localStorage.removeItem("authToken");
      return false;
    } finally {
      sessionStorage.setItem("isValidating", "false");
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
    if (confirm("Biztos mented a változtatásokat?")) {
      const data = {
        userName,
        password,
      };

      try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        await setUser(responseData);

      } catch (error: any) {
        console.error('Failed to patch data:', error);
        alert(error.message);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, validate, logout, update }}>
      {children}
    </AuthContext.Provider>
  );
};