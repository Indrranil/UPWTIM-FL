
export type ItemStatus = "lost" | "found";
export type ClaimStatus = "pending" | "approved" | "rejected";

export interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  date: string;
  location?: string;
  status: ItemStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  secretQuestion?: string;
  secretAnswer?: string;
}

export interface Claim {
  id: string;
  itemId: string;
  claimantId: string;
  answer?: string;
  justification: string;
  proofImageUrl?: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
}
