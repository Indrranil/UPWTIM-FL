import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/types/item";
import { mockUsers } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, RefreshCw } from "lucide-react";

interface CommentListProps {
  comments: Comment[];
  itemId: string;
  onAddComment: (content: string) => Promise<void>;
  isLoading: boolean;
  onRefresh?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  itemId,
  onAddComment,
  isLoading,
  onRefresh,
}) => {
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    await onAddComment(commentContent);
    setCommentContent("");
  };

  if (!user) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Discussion ({comments.length})
          </h2>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            placeholder="Add a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="mb-2"
            rows={3}
          />
          <Button
            type="submit"
            disabled={isLoading || !commentContent.trim()}
            className="ml-auto block"
          >
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </form>

        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No comments yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => {
              // Get the actual user info or create fallback
              const commenter = mockUsers.find(
                (u) => u.id === comment.userId,
              ) || {
                id: comment.userId,
                name: comment.userId === user?.id ? user.name : "Unknown User",
                email: "unknown@example.com",
              };

              return (
                <div key={comment.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${commenter.name}`}
                        alt={commenter.name}
                      />
                      <AvatarFallback>
                        {commenter.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{commenter.name}</h4>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentList;
