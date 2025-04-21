import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/types/item";
import { commentsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getUserById, formatUserIdentifier } from "@/lib/userUtils";

const CommentList: React.FC<{
  comments: Comment[];
  itemId: string;
  onRefresh?: () => void;
}> = ({ comments, itemId, onRefresh }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await commentsApi.createComment({
        itemId,
        content: newComment.trim(),
      });

      setNewComment("");

      toast({
        title: "Comment Posted",
        description: "Your comment has been added successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["comments", itemId] });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
        {user ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              className="w-full p-2 border rounded-md resize-y"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm">Please log in to comment.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => {
        const commenterName = formatUserIdentifier(
          comment.userId,
          comment.userName,
        );
        const isCurrentUser = user && user.id === comment.userId;

        return (
          <div
            key={comment.id}
            className="pb-4 border-b border-gray-200 last:border-0"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                {commenterName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium">
                    {commenterName} {isCurrentUser && "(You)"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          </div>
        );
      })}

      {user && (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            className="w-full p-2 border rounded-md resize-y"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentList;
