
import { Item, Claim } from "@/types/item";

export const mockItems: Item[] = [
  {
    id: "1",
    title: "MacBook Pro Laptop",
    description: "Silver MacBook Pro (13-inch, 2020) last seen in Chanakya Building Room 204.",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=500&fit=crop",
    category: "electronics",
    date: "2025-04-10",
    location: "chanakya",
    status: "lost",
    userId: "user1",
    createdAt: "2025-04-10T10:00:00Z",
    updatedAt: "2025-04-10T10:00:00Z",
    secretQuestion: "What sticker is on the laptop?",
    secretAnswer: "MIT-WPU logo"
  },
  {
    id: "2",
    title: "Water Bottle",
    description: "Blue metal water bottle with a MIT-WPU logo sticker.",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
    category: "other",
    date: "2025-04-09",
    location: "aryabhatta",
    status: "found",
    userId: "user2",
    createdAt: "2025-04-09T14:30:00Z",
    updatedAt: "2025-04-09T14:30:00Z",
    secretQuestion: "What color is the logo on the bottle?",
    secretAnswer: "Red and white"
  },
  {
    id: "3",
    title: "Calculator",
    description: "Scientific calculator (Casio fx-991EX) found in the library.",
    imageUrl: "https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=500&h=500&fit=crop",
    category: "electronics",
    date: "2025-04-08",
    location: "vyas",
    status: "found",
    userId: "user3",
    createdAt: "2025-04-08T16:45:00Z",
    updatedAt: "2025-04-08T16:45:00Z",
    secretQuestion: "What is written on the back of the calculator?",
    secretAnswer: "Student name: Rohit"
  },
  {
    id: "4",
    title: "ID Card",
    description: "Found a student ID card near the cafeteria.",
    imageUrl: "https://images.unsplash.com/photo-1599032909756-5deb82fea3b0?w=500&h=500&fit=crop",
    category: "id-card",
    date: "2025-04-11",
    location: "gargi",
    status: "found",
    userId: "user2",
    createdAt: "2025-04-11T12:15:00Z",
    updatedAt: "2025-04-11T12:15:00Z",
    secretQuestion: "What is the ID number?",
    secretAnswer: "2023CS1234"
  },
  {
    id: "5",
    title: "Headphones",
    description: "Black Sony WH-1000XM4 headphones lost in the library.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "electronics",
    date: "2025-04-07",
    location: "vyas",
    status: "lost",
    userId: "user1",
    createdAt: "2025-04-07T09:20:00Z",
    updatedAt: "2025-04-07T09:20:00Z",
    secretQuestion: "What is special about the right ear cup?",
    secretAnswer: "Small scratch"
  }
];

export const mockClaims: Claim[] = [
  {
    id: "claim1",
    itemId: "2",
    claimantId: "user1",
    answer: "Red and white",
    justification: "I lost my blue water bottle with a MIT-WPU logo sticker yesterday in the Aryabhatta building.",
    proofImageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
    status: "pending",
    createdAt: "2025-04-10T16:45:00Z",
    updatedAt: "2025-04-10T16:45:00Z"
  },
  {
    id: "claim2",
    itemId: "3",
    claimantId: "user1",
    answer: "Student name: Rohit",
    justification: "I lost my calculator during a math class in the Vyas building.",
    status: "approved",
    createdAt: "2025-04-09T11:30:00Z",
    updatedAt: "2025-04-09T14:20:00Z"
  }
];

export const mockUsers = [
  {
    id: "user1",
    name: "Rohit Sharma",
    email: "rohit.sharma@mitwpu.edu.in",
    department: "computer",
    isAuthenticated: true
  },
  {
    id: "user2",
    name: "Priya Patel",
    email: "priya.patel@mitwpu.edu.in",
    department: "design",
    isAuthenticated: true
  },
  {
    id: "user3",
    name: "Aryan Singh",
    email: "aryan.singh@mitwpu.edu.in",
    department: "mechanical",
    isAuthenticated: true
  }
];
