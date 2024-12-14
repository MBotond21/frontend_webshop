export interface User {
    email?: string;
    userName?: string;
    password?: string;
    token: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => void;
    validate: () => void;
    logout: () => void;
  }