import { Item, Claim, Comment } from "@/types/item";

// Mock lost and found items
export const mockItems: Item[] = [
  {
    id: "1",
    title: "Lost Black Wallet",
    description: "Lost my black leather wallet near the library.",
    imageUrl: "/placeholder.svg",
    category: "Wallet",
    type: "personal", // Added required type field
    date: "2025-04-15",
    location: "Main Library",
    status: "lost",
    userId: "user1",
    createdAt: "2025-04-15T10:30:00Z",
    updatedAt: "2025-04-15T10:30:00Z",
    secretQuestion: "What was inside the wallet?",
    secretAnswer: "Student ID and 500 rupees",
  },
  {
    id: "2",
    title: "Found Blue Umbrella",
    description: "Found a blue umbrella at the cafeteria.",
    imageUrl: "/placeholder.svg",
    category: "Umbrella",
    type: "personal", // Added required type field
    date: "2025-04-14",
    location: "Student Cafeteria",
    status: "found",
    userId: "user2",
    createdAt: "2025-04-14T14:45:00Z",
    updatedAt: "2025-04-14T14:45:00Z",
    secretQuestion: "What is the brand of the umbrella?",
    secretAnswer: "Raindrops",
  },
  {
    id: "3",
    title: "Lost MacBook Charger",
    description: "Lost my MacBook charger in Room 302.",
    imageUrl: "/placeholder.svg",
    category: "Electronics",
    type: "electronics", // Added required type field
    date: "2025-04-13",
    location: "Room 302, Engineering Building",
    status: "lost",
    userId: "user3",
    createdAt: "2025-04-13T09:15:00Z",
    updatedAt: "2025-04-13T09:15:00Z",
    secretQuestion: "What wattage is the charger?",
    secretAnswer: "60W",
  },
  {
    id: "4",
    title: "Found Student ID Card",
    description: "Found a student ID card near the sports complex.",
    imageUrl: "/placeholder.svg",
    category: "ID Card",
    type: "id", // Added required type field
    date: "2025-04-12",
    location: "Sports Complex",
    status: "found",
    userId: "user4",
    createdAt: "2025-04-12T16:20:00Z",
    updatedAt: "2025-04-12T16:20:00Z",
    secretQuestion: "What is the student ID number?",
    secretAnswer: "MIT2023456",
  },
  {
    id: "5",
    title: "Lost Prescription Glasses",
    description: "Lost my prescription glasses with black frame.",
    imageUrl: "/placeholder.svg",
    category: "Glasses",
    type: "personal", // Added required type field
    date: "2025-04-11",
    location: "Physics Lab",
    status: "lost",
    userId: "user5",
    createdAt: "2025-04-11T11:10:00Z",
    updatedAt: "2025-04-11T11:10:00Z",
    secretQuestion: "What is the power of the lenses?",
    secretAnswer: "-2.5",
  },
];

// Mock claims data
export const mockClaims: Claim[] = [
  {
    id: "claim1",
    itemId: "1",
    claimantId: "user6",
    status: "pending",
    description:
      "I believe this is my wallet because it matches the description and I lost it in the same location.",
    createdAt: "2025-04-16T08:00:00Z",
    updatedAt: "2025-04-16T08:00:00Z",
    justification:
      "Detailed explanation of why the claimant believes the item belongs to them.",
    proofUrl: "/placeholder.svg",
    answer: "Student ID and 500 rupees",
  },
  {
    id: "claim2",
    itemId: "2",
    claimantId: "user7",
    status: "approved",
    description: "This umbrella looks exactly like the one I lost last week.",
    createdAt: "2025-04-15T12:00:00Z",
    updatedAt: "2025-04-15T12:00:00Z",
    justification:
      "Detailed explanation of why the claimant believes the item belongs to them.",
    proofUrl: "/placeholder.svg",
    answer: "Raindrops",
  },
  {
    id: "claim3",
    itemId: "3",
    claimantId: "user8",
    status: "rejected",
    description:
      "I think this might be my charger, but I'm not completely sure.",
    createdAt: "2025-04-14T18:00:00Z",
    updatedAt: "2025-04-14T18:00:00Z",
    justification:
      "Detailed explanation of why the claimant believes the item belongs to them.",
    proofUrl: "/placeholder.svg",
    notes: "Claim rejected due to insufficient evidence.",
    answer: "Wrong answer",
  },
];

// Mock comments data
export const mockComments: Comment[] = [
  {
    id: "comment1",
    itemId: "1",
    userId: "user9",
    userName: "Alice",
    text: "I saw someone looking for a wallet yesterday, might be worth checking with the library's lost and found.",
    createdAt: "2025-04-15T11:00:00Z",
  },
  {
    id: "comment2",
    itemId: "2",
    userId: "user10",
    userName: "Bob",
    text: "That umbrella looks familiar, I think I've seen it around the engineering department.",
    createdAt: "2025-04-14T15:00:00Z",
  },
  {
    id: "comment3",
    itemId: "3",
    userId: "user11",
    userName: "Charlie",
    text: "I might have seen that charger in the lab, I'll keep an eye out for it.",
    createdAt: "2025-04-13T10:00:00Z",
  },
];

export const mockUsers = [
  { id: "user1", name: "Alice" },
  { id: "user2", name: "Bob" },
  { id: "user3", name: "Charlie" },
  { id: "user4", name: "Diana" },
  { id: "user5", name: "Ethan" },
  { id: "user6", name: "Fiona" },
  { id: "user7", name: "George" },
  { id: "user8", name: "Hannah" },
  { id: "user9", name: "Ivan" },
  { id: "user10", name: "Jane" },
  { id: "user11", name: "Kevin" },
];
