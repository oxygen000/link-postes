import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export default function ReplySection({ ComponentData, comment }) {

      function formatSmartDate(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return postDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  async function getComponentReplies(postId, commentId) {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }

  const {
    data: replies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: () => getComponentReplies(ComponentData, comment._id),
    enabled: !!comment._id,
    select: (res) => res.data?.data?.replies || [],
  });

  console.log(replies);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-text dark:text-text-dark justify-center">
        Loading...
        <span className="inline-block w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (isError) {
    return <h2>Error...</h2>;
  }

  return (
    <>
      {isLoading ? (
        <p className="text-xs text-text-muted">Loading replies...</p>
      ) : replies?.length > 0 ? (
        replies.map((reply) => (
          <div key={reply._id} className="mt-2 flex gap-2">
            <img
              src={reply.commentCreator?.photo}
                alt={reply.commentCreator?.name}
              className="h-6 w-6 rounded-full"
            />

            <div className="text-xs">
              <p className="font-semibold">
                {reply.commentCreator?.name}
              </p>
              <span>
                {formatSmartDate(reply.createdAt)}
              </span>
              <p>{reply.content}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-text-muted dark:text-text-muted-dark">
          No replies yet.
        </p>
      )}
    </>
  );
}
