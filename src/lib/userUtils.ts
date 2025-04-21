import { User } from "@/types/auth";

/**
 * Get user information by ID
 * This utility function handles fetching user information from various sources
 */
export const getUserById = (userId: string): User | null => {
  // First check if this is the current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (currentUser && currentUser.id === userId) {
    return currentUser;
  }

  // Fallback to a default user if we can't find the real one
  return {
    id: userId,
    name: userId.substring(0, 8) + "...", // Truncate the ID as a display name
    email: `${userId.substring(0, 6)}@mitwpu.edu.in`,
    department: "Unknown",
  };
};

/**
 * Format a user ID for display (either shows the name or truncates the ID)
 */
export const formatUserIdentifier = (
  userId: string,
  userName?: string,
): string => {
  if (userName) return userName;
  return userId.length > 12 ? `${userId.substring(0, 8)}...` : userId;
};
