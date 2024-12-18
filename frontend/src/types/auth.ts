export interface User {
    id?: number;
    email?: string;
    userName?: string;
    password?: string;
    token: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => void;
    validate: () => Promise<boolean>;
    logout: () => void;
    update: (id: number, userName?: string, password?: string) => void;
  }