
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers } from "@/lib/mockData";
import ClaimForm from "@/components/claims/ClaimForm";
import ClaimItem from "@/components/claims/ClaimItem";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserIcon, 
  ArrowLeftIcon,
  HandIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, getItemClaims } = useItems();
  const { user } = useAuth();
  
  const [showClaimForm, setShowClaimForm] = useState(false);
  
  if (!id) {
    navigate("/items");
    return null;
  }
  
  const item = getItem(id);
  
  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or may have been removed.</p>
        <Button asChild>
          <Link to="/items">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Items
          </Link>
        </Button>
      </div>
    );
  }
  
  const itemOwner = mockUsers.find(u => u.id === item.userId);
  const categoryLabel = CATEGORIES.find(cat => cat.value === item.category)?.label || item.category;
  const locationLabel = item.location
    ? LOCATIONS.find(loc => loc.value === item.location)?.label || item.location
    : "Location not specified";
  
  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  const claims = getItemClaims(id);
  const userHasClaimed = user && claims.some(claim => claim.claimantId === user.id);
  const isItemOwner = user && user.id === item.userId;
  const canClaim = user && !isItemOwner && item.status === "found" && !userHasClaimed;
  
  return (
    <div>
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  )}
                </div>
                <Badge 
                  className={`absolute top-4 right-4 ${
                    item.status === "lost" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {item.status === "lost" ? "Lost" : "Found"}
                </Badge>
              </div>
              
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{categoryLabel}</Badge>
                  <Badge variant="secondary">
                    {item.status === "lost" ? "Lost on" : "Found on"} {formattedDate}
                  </Badge>
                </div>
                
                <div className="text-gray-700 mb-6">
                  <p>{item.description}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{locationLabel}</span>
                  </div>
                  
                  {itemOwner && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <UserIcon className="h-4 w-4" />
                      <span>Reported by {itemOwner.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Claim Form Section */}
          {showClaimForm && (
            <div className="mt-6">
              <ClaimForm 
                item={item} 
                onCancel={() => setShowClaimForm(false)} 
              />
            </div>
          )}
        </div>
        
        <div>
          {/* Action Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Actions</h2>
              
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Please login to interact with this item</p>
                  <Button asChild>
                    <Link to="/login">Login Now</Link>
                  </Button>
                </div>
              ) : isItemOwner ? (
                <div>
                  <p className="text-gray-600 mb-4">You reported this item</p>
                  {claims.length > 0 ? (
                    <Button 
                      variant="outline" 
                      className="w-full mb-2"
                      onClick={() => navigate(`/dashboard`)}
                    >
                      View Claims ({claims.length})
                    </Button>
                  ) : (
                    <p className="text-sm text-gray-500">No claims have been made yet</p>
                  )}
                </div>
              ) : canClaim ? (
                <div>
                  <p className="text-gray-600 mb-4">Is this your item? Submit a claim now!</p>
                  <Button 
                    className="w-full bg-mitwpu-navy hover:bg-mitwpu-navy/90"
                    onClick={() => setShowClaimForm(true)}
                  >
                    <HandIcon className="mr-2 h-4 w-4" />
                    Claim This Item
                  </Button>
                </div>
              ) : userHasClaimed ? (
                <div>
                  <p className="text-gray-600 mb-4">You have already claimed this item</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/dashboard`)}
                  >
                    View Your Claim
                  </Button>
                </div>
              ) : (
                <p className="text-gray-600">You cannot claim this item</p>
              )}
            </CardContent>
          </Card>
          
          {/* Claims Section for Item Owner */}
          {isItemOwner && claims.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Claims ({claims.length})</h2>
                
                <Tabs defaultValue="pending">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
                    <TabsTrigger value="resolved" className="flex-1">Resolved</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending">
                    <div className="space-y-4">
                      {claims.filter(claim => claim.status === "pending").map(claim => (
                        <ClaimItem key={claim.id} claim={claim} showActions />
                      ))}
                      
                      {claims.filter(claim => claim.status === "pending").length === 0 && (
                        <p className="text-center text-gray-500 py-4">No pending claims</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resolved">
                    <div className="space-y-4">
                      {claims.filter(claim => claim.status !== "pending").map(claim => (
                        <ClaimItem key={claim.id} claim={claim} />
                      ))}
                      
                      {claims.filter(claim => claim.status !== "pending").length === 0 && (
                        <p className="text-center text-gray-500 py-4">No resolved claims</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
