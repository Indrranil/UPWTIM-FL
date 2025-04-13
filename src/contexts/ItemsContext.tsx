
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Item, Claim, ItemStatus, ClaimStatus } from "@/types/item";
import { useToast } from "@/components/ui/use-toast";
import { itemsApi, claimsApi, uploadApi } from "@/services/api";
import { useAuth } from "./AuthContext";

interface ItemsContextType {
  items: Item[];
  claims: Claim[];
  isLoading: boolean;
  error: string | null;
  createItem: (item: Omit<Item, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateItem: (id: string, item: Partial<Item>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  getItem: (id: string) => Item | undefined;
  getUserItems: (status?: ItemStatus) => Item[];
  createClaim: (claim: Omit<Claim, "id" | "claimantId" | "status" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateClaim: (id: string, status: ClaimStatus) => Promise<boolean>;
  getUserClaims: () => Claim[];
  getItemClaims: (itemId: string) => Claim[];
  getClaim: (id: string) => Claim | undefined;
  uploadImage: (file: File) => Promise<string | null>;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load items from API
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch user's claims if user is logged in
  useEffect(() => {
    if (user) {
      fetchClaims();
    }
  }, [user]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await itemsApi.getItems();
      setItems(data);
      setIsLoading(false);
    } catch (error: any) {
      setError("Failed to fetch items");
      console.error("Error fetching items:", error);
      setIsLoading(false);
    }
  };

  const fetchClaims = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await claimsApi.getUserClaims();
      setClaims(data);
      setIsLoading(false);
    } catch (error: any) {
      setError("Failed to fetch claims");
      console.error("Error fetching claims:", error);
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      return await uploadApi.uploadImage(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
      return null;
    }
  };

  const createItem = async (item: Omit<Item, "id" | "userId" | "createdAt" | "updatedAt">): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newItem = await itemsApi.createItem(item);
      setItems(prevItems => [...prevItems, newItem]);
      
      toast({
        title: "Item Created",
        description: `Your ${item.status} item has been successfully reported`,
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create item";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const updateItem = async (id: string, itemUpdate: Partial<Item>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedItem = await itemsApi.updateItem(id, itemUpdate);
      
      setItems(prevItems => prevItems.map(item => 
        item.id === id ? updatedItem : item
      ));
      
      toast({
        title: "Item Updated",
        description: "Your item has been successfully updated",
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update item";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await itemsApi.deleteItem(id);
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      toast({
        title: "Item Deleted",
        description: "Your item has been successfully deleted",
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete item";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const getItem = (id: string): Item | undefined => {
    return items.find(item => item.id === id);
  };

  const getUserItems = (status?: ItemStatus): Item[] => {
    if (!user) return [];
    return items.filter(item => 
      item.userId === user.id && (status ? item.status === status : true)
    );
  };

  const createClaim = async (claim: Omit<Claim, "id" | "claimantId" | "status" | "createdAt" | "updatedAt">): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newClaim = await claimsApi.createClaim(claim);
      
      setClaims(prevClaims => [...prevClaims, newClaim]);
      
      toast({
        title: "Claim Submitted",
        description: "Your claim has been successfully submitted",
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to submit claim";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const updateClaim = async (id: string, status: ClaimStatus): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedClaim = await claimsApi.updateClaim(id, status);
      
      setClaims(prevClaims => prevClaims.map(claim => 
        claim.id === id ? updatedClaim : claim
      ));
      
      toast({
        title: "Claim Updated",
        description: `The claim has been ${status}`,
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update claim";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const getUserClaims = (): Claim[] => {
    if (!user) return [];
    return claims.filter(claim => claim.claimantId === user.id);
  };

  const getItemClaims = (itemId: string): Claim[] => {
    return claims.filter(claim => claim.itemId === itemId);
  };

  const getClaim = (id: string): Claim | undefined => {
    return claims.find(claim => claim.id === id);
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        claims,
        isLoading,
        error,
        createItem,
        updateItem,
        deleteItem,
        getItem,
        getUserItems,
        createClaim,
        updateClaim,
        getUserClaims,
        getItemClaims,
        getClaim,
        uploadImage
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
