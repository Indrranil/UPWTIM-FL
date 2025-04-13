
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { AuthState, LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { authApi } from "@/services/api";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    isLoading: false,
  });
  
  const { toast } = useToast();

  // Check for existing token and get current user on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      getCurrentUser();
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const user = await authApi.getCurrentUser();
      setAuthState({
        user,
        isLoading: false,
        error: null
      });
    } catch (error) {
      localStorage.removeItem('authToken');
      setAuthState({
        user: null,
        isLoading: false,
        error: "Session expired. Please login again."
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    try {
      const user = await authApi.login(credentials);
      
      // Store token from response (assumed to be in user object or response headers)
      if (user && user.token) {
        localStorage.setItem('authToken', user.token);
      }
      
      setAuthState({
        user,
        isLoading: false,
        error: null
      });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred during login";
      
      setAuthState({
        ...authState,
        isLoading: false,
        error: errorMessage
      });
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    try {
      const user = await authApi.register(credentials);
      
      // Store token from response (assumed to be in user object)
      if (user && user.token) {
        localStorage.setItem('authToken', user.token);
      }
      
      setAuthState({
        user,
        isLoading: false,
        error: null
      });
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${user.name}!`,
      });
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred during registration";
      
      setAuthState({
        ...authState,
        isLoading: false,
        error: errorMessage
      });
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    }
  };

  const logout = async () => {
    setAuthState({ ...authState, isLoading: true });
    
    try {
      await authApi.logout();
      setAuthState({ user: null, error: null, isLoading: false });
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      // Even if the API call fails, we'll still remove the token and log out the user
      localStorage.removeItem('authToken');
      setAuthState({ user: null, error: null, isLoading: false });
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
