import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType } from '../types/auth';
import { useNavigate } from 'react-router';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  validate: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setUser({ token });
      }
    };
    loadToken();
  }, []);

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
  

  const validate = async () => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem("authToken")}`,
        },
      });
  
      if (!response.ok) throw new Error("Validation failed");
  
      const data = await response.json();
      setUser({
        id: data.id,
        userName: data.userName,
        email: data.email,
        token: user?.token || localStorage.getItem("authToken")!,
      });
    } catch (error: any) {
      console.error("Validation error:", error);
      setUser(null);
      localStorage.removeItem("authToken");
    }
  };
  

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, validate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};