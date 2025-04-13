
import React from "react";
import { Link } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import { DEPARTMENTS } from "@/lib/constants";
import ItemCard from "@/components/items/ItemCard";
import ClaimItem from "@/components/claims/ClaimItem";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusIcon, 
  SearchIcon, 
  HandIcon,
  PanelTopIcon,
  UserIcon,
  CalendarIcon
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { getUserItems, getUserClaims, getItem } = useItems();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const lostItems = getUserItems("lost");
  const foundItems = getUserItems("found");
  const claims = getUserClaims();
  
  const receivedClaims = user ? foundItems.flatMap(item => {
    const itemClaims = claims.filter(claim => claim.itemId === item.id);
    return itemClaims.map(claim => ({ item, claim }));
  }) : [];
  
  const pendingClaims = receivedClaims.filter(({ claim }) => claim.status === "pending");
  
  const department = DEPARTMENTS.find(dept => dept.value === user.department)?.label || user.department;
  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long"
  });
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-gray-600">Manage your lost and found items</p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/items">
              <SearchIcon className="mr-2 h-4 w-4" />
              Browse Items
            </Link>
          </Button>
          <Button asChild>
            <Link to="/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Report Item
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{user.name}</span>
              </div>
              <div className="flex items-center">
                <PanelTopIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Department:</span>
                <span className="ml-2 font-medium">{department}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Member since:</span>
                <span className="ml-2 font-medium">{joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-mitwpu-navy">{lostItems.length}</p>
                <p className="text-sm text-gray-600">Lost Items</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-mitwpu-navy">{foundItems.length}</p>
                <p className="text-sm text-gray-600">Found Items</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-mitwpu-navy">{claims.length}</p>
                <p className="text-sm text-gray-600">Your Claims</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-mitwpu-navy">{pendingClaims.length}</p>
                <p className="text-sm text-gray-600">Pending Claims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Button asChild className="justify-start bg-mitwpu-navy hover:bg-mitwpu-navy/90">
                <Link to="/create">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Report New Item
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/items">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Browse All Items
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/">
                  <HandIcon className="mr-2 h-4 w-4" />
                  View Found Items
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lost" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="lost" className="flex-1">Lost Items ({lostItems.length})</TabsTrigger>
              <TabsTrigger value="found" className="flex-1">Found Items ({foundItems.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lost">
              {lostItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't reported any lost items yet.</p>
                  <Button asChild>
                    <Link to="/create">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Report Lost Item
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostItems.map(item => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="found">
              {foundItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't reported any found items yet.</p>
                  <Button asChild>
                    <Link to="/create">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Report Found Item
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foundItems.map(item => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="your-claims" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="your-claims" className="flex-1">
                Your Claims ({claims.length})
              </TabsTrigger>
              <TabsTrigger value="received-claims" className="flex-1">
                Received Claims ({receivedClaims.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="your-claims">
              {claims.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't made any claims yet.</p>
                  <Button asChild>
                    <Link to="/items">
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Browse Found Items
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {claims.map(claim => (
                    <ClaimItem key={claim.id} claim={claim} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="received-claims">
              {receivedClaims.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't received any claims on your found items yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {receivedClaims.map(({ claim }) => (
                    <ClaimItem key={claim.id} claim={claim} showActions />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
