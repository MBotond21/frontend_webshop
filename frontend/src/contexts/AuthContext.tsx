import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  validate: () => {},
  logout: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = localStorage.getItem("authToken"); // This is synchronous
      if (token) {
        setUser({ token });
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    const logUser = {
      email: email,
      password: password
  };
    try {
      const response = await fetch(`http://localhost:3000/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logUser),
          //credentials: 'include',
      });
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
      }
      const data = await response.json();
      delete data.userId;
      setUser(data);
      localStorage.setItem("authToken", data.token);
      console.log('User logged in successfully:', data);
  } catch (error: any) {
      alert(error.message);
  }
  };

  const validate = async () => {

    await fetch("http://localhost:3000/users", {
      headers: {Authorization: `Bearer ${user?.token}`}
    })
            .then((response) => {
                if (response.status === 404) {
                    console.log('A kért erőforrás nem található (404)!');
                }
                if (!response.ok) {
                  console.log(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                delete data.id;
                setUser({
                  email: data.email,
                  userName: data.userName,
                  token: user!.token
                });
                console.log(user?.userName);
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.message);
            });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, validate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};