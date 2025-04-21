import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Item, Claim } from "@/types/item";
import { itemsApi, claimsApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ItemsContextProps {
  items: Item[];
  claims: Claim[];
  userItems: Item[];
  userClaims: Claim[];
  loading: boolean;
  isLoading: boolean; // Added this property
  getItem: (id: string) => Item | undefined;
  getItemClaims: (itemId: string) => Claim[];
  fetchItems: () => Promise<void>;
  fetchUserItems: () => Promise<void>;
  fetchUserClaims: () => Promise<void>;
  getReceivedClaims: (userId: string) => Claim[]; // Added this method
  getUserItems: () => Promise<void>; // Added for explicit declaration
  getUserClaims: () => Promise<void>; // Added for explicit declaration
  refreshClaims: () => Promise<void>; // Added this method
  createItem: (
    item: Omit<Item, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => Promise<Item>;
  updateItem: (id: string, item: Partial<Item>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  createClaim: (
    claim: Omit<
      Claim,
      "id" | "claimantId" | "status" | "createdAt" | "updatedAt"
    >,
  ) => Promise<Claim>;
  updateClaim: (id: string, status: string, notes?: string) => Promise<boolean>;
  deleteClaim: (id: string) => Promise<boolean>;
}

const ItemsContext = createContext<ItemsContextProps | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [userClaims, setUserClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added for form submissions

  useEffect(() => {
    fetchItems();

    if (user) {
      fetchUserItems();
      fetchUserClaims();
    }
  }, [user]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await itemsApi.getItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await itemsApi.getUserItems();
      setUserItems(data);
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserClaims = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await claimsApi.getUserClaims();
      setUserClaims(data);
    } catch (error) {
      console.error("Error fetching user claims:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper method to get all claims received for a user's items
  const getReceivedClaims = (userId: string) => {
    const userItemIds = userItems.map((item) => item.id);
    return claims.filter((claim) => userItemIds.includes(claim.itemId));
  };

  // Method to refresh claims data
  const refreshClaims = async () => {
    try {
      const data = await claimsApi.getClaims();
      setClaims(data);
      await fetchUserClaims();
    } catch (error) {
      console.error("Error refreshing claims:", error);
    }
  };

  // Aliases for explicit method naming
  const getUserItems = fetchUserItems;
  const getUserClaims = fetchUserClaims;

  const getItem = (id: string) => {
    return (
      items.find((item) => item.id === id) ||
      userItems.find((item) => item.id === id)
    );
  };

  const getItemClaims = (itemId: string) => {
    return claims.filter((claim) => claim.itemId === itemId);
  };

  const createItem = async (
    item: Omit<Item, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => {
    setIsLoading(true);
    try {
      const newItem = await itemsApi.createItem(item);
      setItems((prev) => [...prev, newItem]);
      setUserItems((prev) => [...prev, newItem]);
      toast({
        title: "Success",
        description: "Item created successfully",
      });
      return newItem;
    } catch (error) {
      console.error("Error creating item:", error);
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id: string, updatedFields: Partial<Item>) => {
    setIsLoading(true);
    try {
      const updatedItem = await itemsApi.updateItem(id, updatedFields);

      // Update items list
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item,
        ),
      );

      // Update user items list
      setUserItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item,
        ),
      );

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    setIsLoading(true);
    try {
      await itemsApi.deleteItem(id);

      // Remove from items list
      setItems((prev) => prev.filter((item) => item.id !== id));

      // Remove from user items list
      setUserItems((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createClaim = async (
    claim: Omit<
      Claim,
      "id" | "claimantId" | "status" | "createdAt" | "updatedAt"
    >,
  ) => {
    setIsLoading(true);
    try {
      const newClaim = await claimsApi.createClaim(claim);
      setUserClaims((prev) => [...prev, newClaim]);
      toast({
        title: "Success",
        description: "Claim submitted successfully",
      });
      return newClaim;
    } catch (error) {
      console.error("Error creating claim:", error);
      toast({
        title: "Error",
        description: "Failed to submit claim",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClaim = async (id: string, status: string, notes?: string) => {
    setIsLoading(true);
    try {
      const updatedClaim = await claimsApi.updateClaim(id, status, notes);

      // Update claims list
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === id ? { ...claim, ...updatedClaim } : claim,
        ),
      );

      // Update user claims list
      setUserClaims((prev) =>
        prev.map((claim) =>
          claim.id === id ? { ...claim, ...updatedClaim } : claim,
        ),
      );

      await fetchItems(); // Refresh items to update statuses

      toast({
        title: "Success",
        description: `Claim ${status.toLowerCase()} successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error updating claim:", error);
      toast({
        title: "Error",
        description: "Failed to update claim",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClaim = async (id: string) => {
    setIsLoading(true);
    try {
      await claimsApi.deleteClaim(id);

      // Remove from claims list
      setClaims((prev) => prev.filter((claim) => claim.id !== id));

      // Remove from user claims list
      setUserClaims((prev) => prev.filter((claim) => claim.id !== id));

      toast({
        title: "Success",
        description: "Claim deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting claim:", error);
      toast({
        title: "Error",
        description: "Failed to delete claim",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        claims,
        userItems,
        userClaims,
        loading,
        isLoading,
        getItem,
        getItemClaims,
        fetchItems,
        fetchUserItems,
        fetchUserClaims,
        getUserItems,
        getUserClaims,
        getReceivedClaims,
        refreshClaims,
        createItem,
        updateItem,
        deleteItem,
        createClaim,
        updateClaim,
        deleteClaim,
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
