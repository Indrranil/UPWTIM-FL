
import React from "react";
import { useNavigate } from "react-router-dom";
import { Claim, ClaimStatus } from "@/types/item";
import { useItems } from "@/contexts/ItemsContext";
import { mockUsers } from "@/lib/mockData";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ClaimItemProps {
  claim: Claim;
  showActions?: boolean;
}

const ClaimItem: React.FC<ClaimItemProps> = ({ claim, showActions = false }) => {
  const { updateClaim, getItem, isLoading } = useItems();
  const navigate = useNavigate();
  
  const item = getItem(claim.itemId);
  const claimant = mockUsers.find(user => user.id === claim.claimantId);
  
  if (!item || !claimant) return null;
  
  const formattedDate = new Date(claim.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
    }
  };
  
  const handleClaimAction = async (status: ClaimStatus) => {
    await updateClaim(claim.id, status);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${claimant.name}`} alt={claimant.name} />
              <AvatarFallback>{claimant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{claimant.name}</h3>
              <p className="text-sm text-gray-500">{claimant.email}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div>{getStatusBadge(claim.status)}</div>
            <p className="text-xs text-gray-500 mt-1">Claimed on {formattedDate}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Item Claimed</h4>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
          </div>
        </div>
        
        {item.secretQuestion && claim.answer && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Secret Question Answer</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm mb-1"><span className="font-medium">Question:</span> {item.secretQuestion}</p>
              <p className="text-sm"><span className="font-medium">Answer:</span> {claim.answer}</p>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Justification</h4>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm">{claim.justification}</p>
          </div>
        </div>
        
        {claim.proofImageUrl && (
          <div>
            <h4 className="text-sm font-medium mb-1">Proof Image</h4>
            <img 
              src={claim.proofImageUrl} 
              alt="Proof" 
              className="rounded-md max-h-40 object-cover" 
            />
          </div>
        )}
      </CardContent>
      
      {showActions && claim.status === "pending" && (
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleClaimAction("rejected")}
            disabled={isLoading}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Reject
          </Button>
          <Button
            onClick={() => handleClaimAction("approved")}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
        </CardFooter>
      )}
      
      {!showActions && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/items/${item.id}`)}
          >
            View Item Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ClaimItem;
