
import React from "react";
import { useItems } from "@/contexts/ItemsContext";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ItemGrid from "@/components/items/ItemGrid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const Items: React.FC = () => {
  const { items } = useItems();
  const { user } = useAuth();
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Items</h1>
          <p className="text-gray-600">Browse through all lost and found items</p>
        </div>
        
        {user && (
          <Button asChild>
            <Link to="/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Report Item
            </Link>
          </Button>
        )}
      </div>
      
      <ItemGrid items={items} />
    </div>
  );
};

export default Items;
