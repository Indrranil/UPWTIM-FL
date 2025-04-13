
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  isAuthenticated: boolean;
  token?: string; // JWT token received from backend
}

export interface AuthState {
  user: User | null;
  error: string | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  department: string;
  password: string;
  confirmPassword: string;
}
