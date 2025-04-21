import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Claim } from "@/types/item";
import { mockUsers } from "@/lib/mockData";
import { claimsApi } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import ImageModal from "@/components/ui/image-modal";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ClaimItemProps {
  claim: Claim;
  showActions?: boolean;
  onAction?: () => void;
}

const ClaimItem: React.FC<ClaimItemProps> = ({
  claim,
  showActions = false,
  onAction,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  console.log("Rendering claim:", claim);

  // Get claimant info - using the claimantName property if available
  const claimant = claim.claimantName
    ? { name: claim.claimantName }
    : mockUsers.find((u) => u.id === claim.claimantId) || {
        name: claim.claimantId
          ? claim.claimantId.substring(0, 8) + "..."
          : "Unknown User",
      };

  const displayName =
    claimant.name || `User ${claim.claimantId?.substring(0, 8) || ""}...`;

  const handleAction = async (status: "approved" | "rejected") => {
    if (!user || isLoading) return;

    setIsLoading(true);

    try {
      await claimsApi.updateClaim(claim.id, status);

      toast({
        title: `Claim ${status === "approved" ? "Approved" : "Rejected"}`,
        description: `You've ${status === "approved" ? "approved" : "rejected"} this claim request.`,
        variant: status === "approved" ? "default" : "destructive",
      });

      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });

      if (onAction) onAction();
    } catch (error) {
      console.error(`Error ${status} claim:`, error);
      toast({
        title: "Error",
        description: `Failed to ${status} the claim. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || isLoading || claim.status !== "pending") return;

    setIsLoading(true);

    try {
      await claimsApi.deleteClaim(claim.id);

      toast({
        title: "Claim Deleted",
        description: "Your claim has been successfully deleted.",
      });

      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ["claims"] });

      if (onAction) onAction();
    } catch (error) {
      console.error("Error deleting claim:", error);
      toast({
        title: "Error",
        description: "Failed to delete the claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (claim.status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
      default:
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        );
    }
  };

  const isClaimant = user && user.id === claim.claimantId;
  const canDelete = isClaimant && claim.status === "pending";

  // If we don't have a full claim object with description/justification, show a simplified view
  const hasDetails = claim.description || claim.justification;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <div className="font-medium">{displayName}</div>
          {getStatusBadge()}
        </div>

        {hasDetails ? (
          <p className="text-sm text-gray-600 mb-3">
            {claim.description ||
              claim.justification ||
              "No description provided"}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic mb-3">
            Claim ID: {claim.id}
          </p>
        )}

        {(claim.proofImageUrl || claim.proofUrl) && (
          <div className="mb-3">
            <div
              className="relative aspect-video bg-gray-100 overflow-hidden rounded-md cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={claim.proofImageUrl || claim.proofUrl}
                alt="Proof image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all">
                <span className="text-transparent hover:text-white text-sm font-medium">
                  Click to view
                </span>
              </div>
            </div>
          </div>
        )}

        {claim.status === "rejected" && claim.notes && (
          <div className="mt-3 p-2 bg-red-50 rounded-md text-sm text-red-700">
            <p className="font-medium mb-1">Rejection reason:</p>
            <p>{claim.notes}</p>
          </div>
        )}

        {showActions && claim.status === "pending" && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
              onClick={() => handleAction("approved")}
              disabled={isLoading}
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
              onClick={() => handleAction("rejected")}
              disabled={isLoading}
            >
              <XCircle className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}

        {canDelete && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete Claim
            </Button>
          </div>
        )}
      </CardContent>

      {/* Image Modal for expanding proof images */}
      {(claim.proofImageUrl || claim.proofUrl) && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={claim.proofImageUrl || claim.proofUrl || ""}
          altText="Claim proof"
        />
      )}
    </Card>
  );
};

export default ClaimItem;
