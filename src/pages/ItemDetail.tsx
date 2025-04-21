import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import ClaimForm from "@/components/claims/ClaimForm";
import ClaimItem from "@/components/claims/ClaimItem";
import CommentList from "@/components/comments/CommentList";
import { Comment, ItemStatus } from "@/types/item";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";
import { commentsApi, itemsApi } from "@/services/api";
import ImageModal from "@/components/ui/image-modal";
import { getUserById, formatUserIdentifier } from "@/lib/userUtils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ArrowLeftIcon,
  HandIcon,
  CheckCircle,
  MessageSquare,
  RefreshCw,
  Trash2,
  Edit,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/auth";

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, getItemClaims, updateItem, deleteItem } = useItems();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  const fetchComments = async () => {
    if (!id) return;

    setIsLoadingComments(true);
    try {
      const fetchedComments = await commentsApi.getItemComments(id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  if (!id) {
    navigate("/items");
    return null;
  }

  const item = getItem(id);

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <p className="text-gray-600 mb-6">
          The item you're looking for doesn't exist or may have been removed.
        </p>
        <Button asChild>
          <Link to="/items">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Items
          </Link>
        </Button>
      </div>
    );
  }

  const itemOwnerName = formatUserIdentifier(item.userId, item.userName);

  const categoryLabel =
    CATEGORIES.find((cat) => cat.value === item.category)?.label ||
    item.category;
  const locationLabel = item.location
    ? LOCATIONS.find((loc) => loc.value === item.location)?.label ||
      item.location
    : "Location not specified";

  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const claims = getItemClaims(id);
  const approvedClaim = claims.find((claim) => claim.status === "approved");
  const userHasClaimed =
    user && claims.some((claim) => claim.claimantId === user.id);
  const isItemOwner = user && user.id === item.userId;
  const canClaim =
    user &&
    !isItemOwner &&
    item.status === "found" &&
    !userHasClaimed &&
    !approvedClaim;

  const approvedClaimantName = approvedClaim
    ? formatUserIdentifier(approvedClaim.claimantId, approvedClaim.claimantName)
    : null;

  const showDiscussion =
    user &&
    ((isItemOwner && approvedClaim) ||
      (approvedClaim && user.id === approvedClaim.claimantId));

  const handleAddComment = async (content: string) => {
    if (!user || !id) return;

    setIsLoadingComments(true);

    try {
      const newComment = await commentsApi.createComment({
        itemId: id,
        content,
      });

      setComments((prev) => [...prev, newComment]);

      toast({
        title: "Comment Posted",
        description: "Your comment has been added to the discussion",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleMarkAsRecovered = async () => {
    if (!isItemOwner || !approvedClaim) return;

    try {
      const success = await updateItem(id, {
        status: "recovered" as ItemStatus,
      });

      if (success) {
        toast({
          title: "Item Recovered",
          description: "The item has been marked as recovered",
        });
      }
    } catch (error) {
      console.error("Error marking item as recovered:", error);
      toast({
        title: "Error",
        description: "Failed to mark item as recovered",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!isItemOwner) return;

    try {
      await deleteItem(id);
      toast({
        title: "Item Deleted",
        description: "Your item has been removed successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete this item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = () => {
    if (!isItemOwner) return;
    navigate(`/dashboard?edit=${id}`);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <div
                  className="aspect-[16/9] w-full overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => item.imageUrl && openImageModal(item.imageUrl)}
                >
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
                    item.status === "lost"
                      ? "bg-red-500"
                      : item.status === "found"
                        ? "bg-green-500"
                        : "bg-blue-500"
                  }`}
                >
                  {item.status === "lost"
                    ? "Lost"
                    : item.status === "found"
                      ? "Found"
                      : "Recovered"}
                </Badge>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold mb-2">{item.title}</h1>

                  {isItemOwner && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditItem}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteItem}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{categoryLabel}</Badge>
                  <Badge variant="secondary">
                    {item.status === "lost" ? "Lost on" : "Found on"}{" "}
                    {formattedDate}
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

                  {itemOwnerName && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <UserIcon className="h-4 w-4" />
                      <span>Reported by {itemOwnerName}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {showClaimForm && (
            <div className="mt-6">
              <ClaimForm item={item} onCancel={() => setShowClaimForm(false)} />
            </div>
          )}

          {showDiscussion && (
            <div className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Discussion ({comments.length})
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchComments}
                      disabled={isLoadingComments}
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-1 ${isLoadingComments ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </Button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const content = (
                        e.currentTarget.elements.namedItem(
                          "commentContent",
                        ) as HTMLTextAreaElement
                      ).value;
                      if (content.trim()) {
                        handleAddComment(content);
                        (
                          e.currentTarget.elements.namedItem(
                            "commentContent",
                          ) as HTMLTextAreaElement
                        ).value = "";
                      }
                    }}
                    className="mb-6"
                  >
                    <textarea
                      name="commentContent"
                      placeholder="Add a comment..."
                      className="w-full p-3 border rounded-md mb-2 min-h-24"
                      rows={3}
                    />
                    <Button
                      type="submit"
                      disabled={isLoadingComments}
                      className="ml-auto block"
                    >
                      {isLoadingComments ? "Posting..." : "Post Comment"}
                    </Button>
                  </form>

                  {comments.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No comments yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment, index) => {
                        let commenter: User = getUserById(comment.userId) || {
                          id: comment.userId,
                          name: "User",
                          email: "unknown@example.com",
                        };

                        if (!commenter) {
                          if (comment.userId === item.userId) {
                            commenter = itemOwnerName
                              ? {
                                  id: item.userId,
                                  name: itemOwnerName,
                                  email: "unknown@example.com",
                                }
                              : {
                                  id: item.userId,
                                  name: "Item Reporter",
                                  email: "unknown@example.com",
                                };
                          } else if (
                            approvedClaim &&
                            comment.userId === approvedClaim.claimantId
                          ) {
                            commenter = approvedClaimantName
                              ? {
                                  id: approvedClaim.claimantId,
                                  name: approvedClaimantName,
                                  email: "unknown@example.com",
                                }
                              : {
                                  id: approvedClaim.claimantId,
                                  name: "Claimant",
                                  email: "unknown@example.com",
                                };
                          } else if (user && comment.userId === user.id) {
                            commenter = {
                              id: user.id,
                              name: user.name,
                              email: user.email,
                              department: user.department,
                              isAuthenticated: user.isAuthenticated,
                            };
                          } else {
                            commenter = {
                              id: comment.userId,
                              name: "User",
                              email: "unknown@example.com",
                            };
                          }
                        }

                        return (
                          <div key={comment.id}>
                            {index > 0 && <hr className="my-4" />}
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                {commenter.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">
                                    {commenter.name}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      comment.createdAt,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <p className="mt-1 text-gray-700">
                                  {comment.content}
                                </p>
                                {comment.imageUrl && (
                                  <div className="mt-2">
                                    <img
                                      src={comment.imageUrl}
                                      alt="Comment attachment"
                                      className="max-h-40 rounded cursor-pointer border border-gray-200"
                                      onClick={() =>
                                        openImageModal(comment.imageUrl!)
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Actions</h2>

              {!user ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    Please login to interact with this item
                  </p>
                  <Button asChild>
                    <Link to="/login">Login Now</Link>
                  </Button>
                </div>
              ) : isItemOwner ? (
                <div>
                  <p className="text-gray-600 mb-4">You reported this item</p>
                  {claims.length > 0 ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full mb-3"
                        onClick={() => navigate(`/dashboard`)}
                      >
                        View Claims ({claims.length})
                      </Button>

                      {approvedClaim && item.status !== "recovered" && (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={handleMarkAsRecovered}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Recovered
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No claims have been made yet
                    </p>
                  )}
                </div>
              ) : canClaim ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Is this your item? Submit a claim now!
                  </p>
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
                  <p className="text-gray-600 mb-4">
                    You have already claimed this item
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/dashboard`)}
                  >
                    View Your Claim
                  </Button>
                </div>
              ) : approvedClaim && user.id === approvedClaim.claimantId ? (
                <div>
                  <p className="text-green-600 font-medium mb-2">
                    Your claim has been approved!
                  </p>
                  <p className="text-gray-600 mb-4">
                    Use the discussion thread to coordinate pickup with the item
                    reporter.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/dashboard`)}
                  >
                    View Claim Details
                  </Button>
                </div>
              ) : item.status === "recovered" ? (
                <div>
                  <p className="text-blue-600 font-medium mb-2">
                    This item has been recovered
                  </p>
                  <p className="text-gray-600">
                    The item has been returned to its owner
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">You cannot claim this item</p>
              )}
            </CardContent>
          </Card>

          {isItemOwner && claims.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">
                  Claims ({claims.length})
                </h2>

                <Tabs defaultValue="pending">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="pending" className="flex-1">
                      Pending
                    </TabsTrigger>
                    <TabsTrigger value="resolved" className="flex-1">
                      Resolved
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending">
                    <div className="space-y-4">
                      {claims
                        .filter((claim) => claim.status === "pending")
                        .map((claim) => {
                          const claimant = getUserById(claim.claimantId) || {
                            id: claim.claimantId,
                            name: claim.claimantName || "User",
                            email: "unknown@example.com",
                          };

                          const claimWithUser = {
                            ...claim,
                            claimantName: claimant.name,
                          };

                          return (
                            <ClaimItem
                              key={claim.id}
                              claim={claimWithUser}
                              showActions
                            />
                          );
                        })}

                      {claims.filter((claim) => claim.status === "pending")
                        .length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          No pending claims
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="resolved">
                    <div className="space-y-4">
                      {claims
                        .filter((claim) => claim.status !== "pending")
                        .map((claim) => {
                          const claimant = getUserById(claim.claimantId) || {
                            id: claim.claimantId,
                            name: claim.claimantName || "User",
                            email: "unknown@example.com",
                          };

                          const claimWithUser = {
                            ...claim,
                            claimantName: claimant.name,
                          };

                          return (
                            <ClaimItem key={claim.id} claim={claimWithUser} />
                          );
                        })}

                      {claims.filter((claim) => claim.status !== "pending")
                        .length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          No resolved claims
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {approvedClaim && user && user.id === approvedClaim.claimantId && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Claim Status</h2>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-semibold text-green-700">
                      Your claim has been approved!
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Contact the item reporter through the discussion thread to
                    arrange a pickup.
                  </p>
                </div>
                {item.status === "recovered" ? (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-blue-700 text-sm">
                      This item has been marked as recovered.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-yellow-600 mr-2" />
                      <p className="text-yellow-700 text-sm">
                        Use the discussion thread to coordinate with{" "}
                        {itemOwnerName}.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default ItemDetail;
