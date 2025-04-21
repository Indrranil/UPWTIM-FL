import axios from "axios";
import { LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { Item, Claim, Comment, Report } from "@/types/item";
import { Analytics } from "@/types/admin";

// Configure the base URL for your Spring Boot API
// This would typically be stored in an environment variable
const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to requests when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Auth API endpoints
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post("/auth/login", credentials);
    // Store the token from the response
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await api.post("/auth/register", credentials);
    // Store the token from the response
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("authToken");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Items API endpoints
export const itemsApi = {
  getItems: async (): Promise<Item[]> => {
    const response = await api.get("/items");
    return response.data;
  },

  getItem: async (id: string): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  createItem: async (
    item: Omit<Item, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<Item> => {
    const response = await api.post("/items", item);
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
    const response = await api.get("/items/user");
    return response.data;
  },

  getMatchingItems: async (id: string): Promise<Item[]> => {
    const response = await api.get(`/items/match/${id}`);
    return response.data;
  },
};

// Claims API endpoints
export const claimsApi = {
  getClaims: async (): Promise<Claim[]> => {
    const response = await api.get("/claims");
    return response.data;
  },

  getClaim: async (id: string): Promise<Claim> => {
    const response = await api.get(`/claims/${id}`);
    return response.data;
  },

  createClaim: async (
    claim: Omit<
      Claim,
      "id" | "claimantId" | "status" | "createdAt" | "updatedAt"
    >,
  ): Promise<Claim> => {
    const response = await api.post("/claims", claim);
    return response.data;
  },

  updateClaim: async (
    id: string,
    status: string,
    notes?: string,
  ): Promise<Claim> => {
    const response = await api.put(`/claims/${id}`, { status, notes });
    return response.data;
  },

  getUserClaims: async (): Promise<Claim[]> => {
    const response = await api.get("/claims/user");
    return response.data;
  },

  getItemClaims: async (itemId: string): Promise<Claim[]> => {
    const response = await api.get(`/claims/item/${itemId}`);
    return response.data;
  },

  deleteClaim: async (id: string): Promise<void> => {
    await api.delete(`/claims/${id}`);
  },
};

// Comments API endpoints
export const commentsApi = {
  getItemComments: async (itemId: string): Promise<Comment[]> => {
    const response = await api.get(`/comments/item/${itemId}`);
    return response.data;
  },

  createComment: async (
    comment: Omit<Comment, "id" | "userId" | "createdAt">,
  ): Promise<Comment> => {
    const response = await api.post("/comments", comment);
    return response.data;
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};

// Upload API endpoint
export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.url;
  },
};

// Admin API endpoints
export const adminApi = {
  // Items management
  getAllItems: async (): Promise<Item[]> => {
    const response = await api.get("/admin/items");
    return response.data;
  },

  updateItemStatus: async (id: string, status: string): Promise<Item> => {
    const response = await api.put(`/admin/items/${id}/status`, { status });
    return response.data;
  },

  removeItem: async (id: string): Promise<void> => {
    await api.delete(`/admin/items/${id}`);
  },

  // Users management
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  // Claims management
  getAllClaims: async (): Promise<Claim[]> => {
    const response = await api.get("/admin/claims");
    return response.data;
  },

  updateClaimStatus: async (
    id: string,
    status: string,
    notes?: string,
  ): Promise<Claim> => {
    const response = await api.put(`/admin/claims/${id}`, { status, notes });
    return response.data;
  },

  // Reports management
  getAllReports: async (): Promise<Report[]> => {
    const response = await api.get("/admin/reports");
    return response.data;
  },

  getPendingReports: async (): Promise<Report[]> => {
    const response = await api.get("/admin/reports/pending");
    return response.data;
  },

  getReport: async (id: string): Promise<Report> => {
    const response = await api.get(`/admin/reports/${id}`);
    return response.data;
  },

  updateReport: async (
    id: string,
    status: string,
    adminNotes?: string,
  ): Promise<Report> => {
    const response = await api.put(`/admin/reports/${id}`, {
      status,
      adminNotes,
    });
    return response.data;
  },

  // User-facing report endpoints
  createReport: async (
    report: Omit<
      Report,
      "id" | "reporterId" | "status" | "adminId" | "createdAt" | "updatedAt"
    >,
  ): Promise<Report> => {
    const response = await api.post("/reports", report);
    return response.data;
  },

  // Analytics
  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },
};

export default api;
