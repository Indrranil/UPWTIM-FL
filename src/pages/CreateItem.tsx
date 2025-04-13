
import React, { useState } from "react";
import ItemForm from "@/components/items/ItemForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemStatus } from "@/types/item";

const CreateItem: React.FC = () => {
  const [type, setType] = useState<ItemStatus>("lost");
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Report an Item</h1>
      
      <Tabs
        value={type}
        onValueChange={(value) => setType(value as ItemStatus)}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lost">Lost Item</TabsTrigger>
          <TabsTrigger value="found">Found Item</TabsTrigger>
        </TabsList>
        <TabsContent value="lost">
          <ItemForm type="lost" />
        </TabsContent>
        <TabsContent value="found">
          <ItemForm type="found" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateItem;
