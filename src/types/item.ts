export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  location: string;
  date?: string; // Added date field
  imageUrl: string;
  secretQuestion?: string; // Added secret question field
  secretAnswer?: string; // Added secret answer field
  createdAt: string;
  updatedAt: string;
}

export type ItemStatus = "lost" | "found" | "recovered";

export interface Claim {
  id: string;
  itemId: string;
  claimantId: string;
  claimantName?: string;
  status: string;
  description?: string; // Original field
  justification?: string; // Added for compatibility
  proofUrl?: string; // Original field
  proofImageUrl?: string; // Added for compatibility
  notes?: string;
  answer?: string; // Added secret answer field
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  itemId: string;
  userId: string;
  userName?: string;
  text?: string; // Original field
  content?: string; // Added for compatibility
  imageUrl?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  itemId: string;
  reporterId: string;
  status: string;
  reason: string;
  description: string;
  adminNotes?: string;
  adminId?: string;
  createdAt: string;
  updatedAt: string;
}
