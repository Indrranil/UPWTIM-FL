import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";

export const ClaimDisputes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Query claims
  const { data: claims = [], isLoading } = useQuery({
    queryKey: ["admin", "claims"],
    queryFn: adminApi.getAllClaims,
  });

  // Update claim status mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: string;
      notes?: string;
    }) => adminApi.updateClaimStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "claims"] });
      toast({
        title: "Claim Updated",
        description: "Claim status has been updated successfully",
      });
      setDialogOpen(false);
      setSelectedClaim(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "There was an error updating the claim",
        variant: "destructive",
      });
      console.error("Error updating claim:", error);
    },
  });

  // Filter claims based on search term
  const filteredClaims = claims.filter(
    (claim) =>
      claim.itemId.includes(searchTerm) ||
      claim.justification?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Claim Disputes</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No claims found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item ID</TableHead>
                  <TableHead>Claimant ID</TableHead>
                  <TableHead>Justification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">
                      {claim.itemId}
                    </TableCell>
                    <TableCell>{claim.claimantId}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {claim.justification}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(claim.status)}>
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {claim.createdAt &&
                        format(new Date(claim.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClaim(claim);
                          setDialogOpen(true);
                        }}
                      >
                        Review
                      </Button>
                      {claim.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                id: claim.id,
                                status: "approved",
                              })
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                id: claim.id,
                                status: "rejected",
                              })
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Claim Details</DialogTitle>
              <DialogDescription>
                Review the claim details and take appropriate action.
              </DialogDescription>
            </DialogHeader>
            {selectedClaim && (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Item ID:</p>
                  <p>{selectedClaim.itemId}</p>
                </div>
                <div>
                  <p className="font-semibold">Claimant ID:</p>
                  <p>{selectedClaim.claimantId}</p>
                </div>
                <div>
                  <p className="font-semibold">Justification:</p>
                  <p>{selectedClaim.justification}</p>
                </div>
                {selectedClaim.answer && (
                  <div>
                    <p className="font-semibold">Secret Answer:</p>
                    <p>{selectedClaim.answer}</p>
                  </div>
                )}
                <div>
                  <p className="font-semibold">Status:</p>
                  <Badge variant={getStatusVariant(selectedClaim.status)}>
                    {selectedClaim.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold">Admin Notes:</p>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this claim..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter className="flex justify-between">
              {selectedClaim && selectedClaim.status === "pending" && (
                <div className="space-x-2">
                  <Button
                    variant="default"
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedClaim.id,
                        status: "approved",
                        notes: adminNotes,
                      })
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedClaim.id,
                        status: "rejected",
                        notes: adminNotes,
                      })
                    }
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
