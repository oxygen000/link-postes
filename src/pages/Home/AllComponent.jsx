import axios from "axios";
import {
  FaEllipsisH,
  FaRegSmile,
  FaPaperPlane,
  FaRegImage,
  FaEdit,
} from "react-icons/fa";
import { authContext } from "../../context/AuthContextProvider";
import { useContext, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiMessageCircle } from "react-icons/fi";
import { jwt_decode } from "jwt-decode-es";
import { MdDeleteOutline } from "react-icons/md";

export default function AllComponent({ ComponentData }) {
  const commentRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  let { token, user } = useContext(authContext);
  const queryClient = useQueryClient();
  const decodedToken = token ? jwt_decode(token) : null;
  const currentUserId = decodedToken?.user;
  const [isEditing, setIsEditing] = useState(false);

  const likeMutation = useMutation({
    mutationFn: async (commentId) => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${ComponentData}/comments/${commentId}/like`,
        {},
        { headers: { token } },
      );
    },
    onSuccess: () => {
      toast.success("Like Success ");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error");
    },
  });

  async function getLinksModal() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${ComponentData}/comments?page=1&limit=10`,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const putCommentMutation = useMutation({
    mutationFn: async ({ content, commentId }) => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${ComponentData}/comments/${commentId}`,
        { content },
        { headers: { token } },
      );
    },
    onSuccess: () => {
      toast.success("Comment Updated ✅");
      queryClient.invalidateQueries(["posts"]);
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error updating comment ❌");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (commentId) => {
      return axios.delete(
        `https://route-posts.routemisr.com/posts/${ComponentData}/comments/${commentId}`,
        {
          headers: { token },
        },
      );
    },
    onSuccess: () => {
      toast.success("Post Delete successfully ✅");

      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error");
    },
  });

  const postCommentMutation = useMutation({
    mutationFn: async (content) => {
      return axios.post(
        `https://route-posts.routemisr.com/posts/${ComponentData}/comments`,
        { content },
        { headers: { token } },
      );
    },
    onSuccess: () => {
      toast.success("Comment added ✅");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding comment ❌");
    },
  });

  let {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery({
    queryFn: getLinksModal,
    queryKey: ["LinksModal", ComponentData],
    select: (res) => res.data.data.comments,
  });

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

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="border rounded-xl border-border bg-bg dark:border-border-dark dark:bg-bg-dark px-4 py-4">
      {/* HEADER */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark px-3 py-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-extrabold tracking-wide text-text dark:text-text-dark">
            Comments
          </p>

          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary dark:text-primary">
            {comments?.length}
          </span>
        </div>

        <select className="rounded-lg border border-border bg-hover dark:border-border-dark dark:bg-hover-dark px-2.5 py-1.5 text-xs font-bold text-text dark:text-text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option>Most relevant</option>
          <option>Newest</option>
        </select>
      </div>

      {/* COMMENT */}
      {comments.length > 0 ? (
        <>
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment._id}>
                <div className="relative flex items-start gap-2">
                  <img
                    src={comment.commentCreator.photo}
                    alt={comment.commentCreator.name}
                    className="mt-0.5 h-8 w-8 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="relative inline-block rounded-2xl bg-hover dark:bg-hover-dark px-3 py-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-text dark:text-text-dark">
                            {comment.commentCreator.name}
                          </p>

                          <p className="text-xs text-text-muted dark:text-text-muted-dark">
                            {formatSmartDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="relative inline-block max-w-full rounded-2xl bg-hover dark:bg-hover-dark px-3 py-2 mt-3">
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              className="w-full rounded-full border border-border dark:border-border-dark bg-card dark:bg-card-dark px-3 py-1.5 text-sm"
                              defaultValue={comment.content}
                              ref={commentRef}
                            />
                            <button
                              className="rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5]"
                              onClick={() => {
                                const content =
                                  commentRef.current.value?.trim();
                                if (!content) {
                                  toast.error("Comment cannot be empty ❌");
                                  return;
                                }

                                putCommentMutation.mutate(
                                  { content, commentId: comment._id },
                                  {
                                    onSuccess: () => {
                                      commentRef.current.value = "";
                                    },
                                  },
                                );
                              }}
                              disabled={putCommentMutation.isLoading}
                            >
                              {putCommentMutation.isLoading
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-text dark:text-text-dark">
                          {comment.content}
                        </p>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-1.5 flex items-center justify-between px-1">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-text-muted dark:text-text-muted-dark">
                          {formatSmartDate(comment.createdAt)}
                        </span>
                        <button
                          onClick={() => likeMutation.mutate(comment._id)}
                          className="text-xs font-semibold text-text-muted cursor-pointer dark:text-text-muted-dark hover:underline"
                        >
                          Like ({comment.likes.length || 0})
                        </button>

                        <button className="text-xs font-semibold cursor-pointer text-text-muted dark:text-text-muted-dark hover:text-primary dark:hover:text-primary-hover hover:underline">
                          Reply
                        </button>
                      </div>

                      {comment.commentCreator._id === currentUserId && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === comment.commentCreator._id
                                  ? null
                                  : comment.commentCreator._id,
                              )
                            }
                            className="rounded-full p-2 cursor-pointer bg-transparent text-text-muted dark:text-text-muted-dark hover:bg-hover dark:hover:bg-hover-dark"
                          >
                            <FaEllipsisH className="w-4 h-4" />
                          </button>

                          {openMenuId === comment.commentCreator._id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-50">
                              <button
                                onClick={() => setIsEditing(true)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center gap-2"
                              >
                                <FaEdit /> Edit
                              </button>

                              <button
                                onClick={() =>
                                  deletePostMutation.mutate(comment._id)
                                }
                                className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center gap-2"
                              >
                                <MdDeleteOutline /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark px-4 py-8 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-card dark:bg-card-dark text-[#1877f2]">
              <FiMessageCircle className="w-6 h-6" />
            </div>
            <p className="text-lg font-extrabold text-text dark:text-text-dark">
              No comments yet
            </p>
            <p className="mt-1 text-sm font-medium text-text-muted dark:text-text-muted-dark">
              Be the first to comment.
            </p>
          </div>
        </>
      )}

      {/* ADD COMMENT */}
      <div className="mt-3">
        <div className="flex items-start gap-2">
          <img
            src={user?.photo}
            alt={user?.name}
            className="h-9 w-9 rounded-full object-cover"
          />

          <div className="w-full rounded-2xl border border-border bg-hover dark:border-border-dark dark:bg-hover-dark px-2.5 py-1.5 focus-within:border-primary focus-within:bg-card dark:focus-within:bg-card-dark">
            <textarea
              ref={commentRef}
              placeholder="Write a comment..."
              rows="1"
              className="max-h-[140px] min-h-[40px] w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-text-muted dark:placeholder:text-text-muted-dark dark:text-text-dark"
            />

            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="rounded-full p-2 text-text-muted dark:text-text-muted-dark hover:bg-hover dark:hover:bg-hover-dark hover:text-success">
                  <FaRegImage size={14} />
                </button>

                <button className="rounded-full p-2 text-text-muted dark:text-text-muted-dark hover:bg-hover dark:hover:bg-hover-dark hover:text-warning">
                  <FaRegSmile size={14} />
                </button>
              </div>

              <button
                onClick={() => {
                  const content = commentRef.current.value?.trim();
                  if (!content) {
                    toast.error("Comment cannot be empty ❌");
                    return;
                  }

                  postCommentMutation.mutate(content, {
                    onSuccess: () => {
                      commentRef.current.value = "";
                    },
                  });
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary hover:bg-primary-hover text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
