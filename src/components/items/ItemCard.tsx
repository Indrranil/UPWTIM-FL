import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/item";
import {
  MapPin,
  Calendar,
  ArrowUpRight,
  AlertTriangle,
  Share2,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ReportForm } from "@/components/reports/ReportForm";
import { useAuth } from "@/contexts/AuthContext";
import { itemsApi } from "@/services/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [matchingItems, setMatchingItems] = useState<Item[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  const fetchMatches = async () => {
    if (isLoadingMatches || matchingItems.length > 0) return;

    setIsLoadingMatches(true);
    try {
      const matches = await itemsApi.getMatchingItems(item.id);
      setMatchingItems(matches);
    } catch (error) {
      console.error("Error fetching matching items:", error);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <AspectRatio ratio={16 / 9}>
        <img
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-1">{item.title}</CardTitle>
          <Badge
            variant={
              item.status === "lost"
                ? "destructive"
                : item.status === "found"
                  ? "default"
                  : "secondary"
            }
          >
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{item.date}</span>
        </div>
        {item.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{item.location}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="default" size="sm" asChild>
          <Link to={`/items/${item.id}`}>
            View Details <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
        <div className="flex gap-2">
          {isAuthenticated && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchMatches}
                  disabled={isLoadingMatches}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  {isLoadingMatches ? "Loading..." : "Matches"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0">
                <div className="p-3 border-b">
                  <h4 className="font-semibold">
                    Potential {item.status === "lost" ? "Found" : "Lost"}{" "}
                    Matches
                  </h4>
                </div>
                <div className="p-2 max-h-80 overflow-y-auto">
                  {matchingItems.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">
                      No potential matches found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {matchingItems.map((match) => (
                        <div key={match.id} className="flex gap-2 p-2 border-b">
                          <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            {match.imageUrl ? (
                              <img
                                src={match.imageUrl}
                                alt={match.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h5 className="font-medium text-sm truncate">
                              {match.title}
                            </h5>
                            <p className="text-xs text-gray-500 truncate">
                              {match.description}
                            </p>
                            <Link
                              to={`/items/${match.id}`}
                              className="text-xs text-blue-600 hover:underline mt-1 block"
                            >
                              View item →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReportDialogOpen(true)}
            >
              <AlertTriangle className="h-4 w-4 mr-1" /> Report
            </Button>
          )}
        </div>
      </CardFooter>

      {isAuthenticated && (
        <ReportForm
          itemId={item.id}
          isOpen={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
        />
      )}
    </Card>
  );
};

export default ItemCard;
