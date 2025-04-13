
import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '@/types/auth';
import { Item, Claim } from '@/types/item';

// Configure the base URL for your Spring Boot API
// This would typically be stored in an environment variable
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API endpoints
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/login', credentials);
    // Store the token from the response
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  
  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await api.post('/auth/register', credentials);
    // Store the token from the response
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Items API endpoints
export const itemsApi = {
  getItems: async (): Promise<Item[]> => {
    const response = await api.get('/items');
    return response.data;
  },
  
  getItem: async (id: string): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },
  
  createItem: async (item: Omit<Item, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Item> => {
    const response = await api.post('/items', item);
    return response.data;
  },
  
  updateItem: async (id: string, item: Partial<Item>): Promise<Item> => {
    const response = await api.put(`/items/${id}`, item);
    return response.data;
  },
  
  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
  
  getUserItems: async (): Promise<Item[]> => {
    const response = await api.get('/items/user');
    return response.data;
  },
};

// Claims API endpoints
export const claimsApi = {
  getClaims: async (): Promise<Claim[]> => {
    const response = await api.get('/claims');
    return response.data;
  },
  
  getClaim: async (id: string): Promise<Claim> => {
    const response = await api.get(`/claims/${id}`);
    return response.data;
  },
  
  createClaim: async (claim: Omit<Claim, "id" | "claimantId" | "status" | "createdAt" | "updatedAt">): Promise<Claim> => {
    const response = await api.post('/claims', claim);
    return response.data;
  },
  
  updateClaim: async (id: string, status: string): Promise<Claim> => {
    const response = await api.put(`/claims/${id}`, { status });
    return response.data;
  },
  
  getUserClaims: async (): Promise<Claim[]> => {
    const response = await api.get('/claims/user');
    return response.data;
  },
  
  getItemClaims: async (itemId: string): Promise<Claim[]> => {
    const response = await api.get(`/claims/item/${itemId}`);
    return response.data;
  },
};

// Upload API endpoint
export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  },
};

export default api;
