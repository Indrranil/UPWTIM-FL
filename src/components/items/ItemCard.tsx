
import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Item } from "@/types/item";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const categoryLabel = CATEGORIES.find(cat => cat.value === item.category)?.label || item.category;
  const locationLabel = item.location 
    ? LOCATIONS.find(loc => loc.value === item.location)?.label || item.location
    : "Location not specified";

  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square relative overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <Badge 
          className={`absolute top-2 right-2 ${
            item.status === "lost" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {item.status === "lost" ? "Lost" : "Found"}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{item.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
        <Badge variant="outline" className="mb-2">{categoryLabel}</Badge>
        
        <div className="flex flex-col space-y-1 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{locationLabel}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link 
          to={`/items/${item.id}`}
          className="w-full text-center py-2 bg-mitwpu-navy text-white rounded-md hover:bg-mitwpu-navy/90 transition-colors"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
