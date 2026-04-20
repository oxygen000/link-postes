import { Button } from "@heroui/react";
import {
  FaThumbsUp,
  FaRegCommentDots,
  FaShareAlt,
  FaGlobeAmericas,
  FaEllipsisH,
  FaBookmark,
  FaEdit,
  FaUsers,
  FaLock,
  FaChevronDown,
} from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../context/AuthContextProvider";
import axios from "axios";
import AllLikesModal from "./AllLikesModal";
import AllComponent from "./AllComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { jwt_decode } from "jwt-decode-es";

export default function PostCard({ post }) {
  const { token } = useContext(authContext);
  const [open, setOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const decodedToken = token ? jwt_decode(token) : null;
  const currentUserId = decodedToken?.user;

  const {
    user,
    body,
    image,
    createdAt,
    privacy,
    _id,
    likesCount,
    sharesCount,
    commentsCount,
    sharedPost,
    topComment,
  } = post;

  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareText, setShareText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.body || "");
  const [notBody, setBody] = useState(post?.body || "");
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const queryClient = useQueryClient();
  const [postSelectedOpen, setpostSelectedOpen] = useState(false);

  const isLiked = post.likes.includes(currentUserId);
  const handleLike = useMutation({
    mutationFn: async (postId) => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        {},
        { headers: { token } },
      );
    },
    onSuccess: () => {
      toast.success("Post liked ✅");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error");
    },
  });

  const savePostMutation = useMutation({
    mutationFn: async (postId) => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
        {},
        { headers: { token } },
      );
    },
    onSuccess: () => {
      toast.success("Post saved successfully ✅");

      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error");
    },
  });

  const handleShare = useMutation({
    mutationFn: async ({ postId, body }) => {
      return axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/share`,
        { body },
        { headers: { token } },
      );
    },

    onSuccess: () => {
      toast.success("Post shared successfully ✅");
      queryClient.invalidateQueries(["posts"]);
      setIsShareOpen(false);
      setShareText("");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Error");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
        headers: { token },
      });
    },
    onSuccess: () => {
      toast.success("Post Delete successfully ✅");

      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error");
    },
  });

  const editPostMutation = useMutation({
    mutationFn: async ({ _id, body }) => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${_id}`,
        { body },
        { headers: { token } },
      );
    },
    onSuccess: (_, variables) => {
      toast.success("Post updated successfully ✅");
      setBody(variables.body);
      setIsEditing(false);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error");
    },
  });

  const editPrivacyPostMutation = useMutation({
    mutationFn: async ({ _id, privacy }) => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${_id}`,
        { privacy },
        { headers: { token } },
      );
    },

    onSuccess: (_, variables) => {
      toast.success("Privacy updated successfully ✅");

      setPostPrivacy(variables.privacy);

      setpostSelectedOpen(false);

      queryClient.invalidateQueries(["posts"]);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Error");
    },
  });

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

  const [postPrivacy, setPostPrivacy] = useState(privacy);

  const options = [
    { value: "public", label: "Public", icon: FaGlobeAmericas },
    { value: "following", label: "Followers", icon: FaUsers },
    { value: "only_me", label: "Only me", icon: FaLock },
  ];
  const selectedOption = options.find((opt) => opt.value === postPrivacy);

  const Icon = selectedOption?.icon;

  return (
    <div className="mt-4 overflow-visible rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm transition-colors">
      {/* HEADER */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={user?.photo}
            alt="profile"
            className="h-11 w-11 rounded-full object-cover"
          />

          <div className="flex-1 min-w-0">
            <h3 className="truncate text-sm font-bold text-text dark:text-text-dark">
              <Link to={`/profile/${user?._id}`} className="hover:underline">
                {user?.name}
              </Link>
            </h3>

            <div className="flex items-center gap-1 text-xs text-text-muted dark:text-text-muted-dark">
              <Link to={`/posts/${_id}`} className="hover:underline">
                {formatSmartDate(createdAt)}
              </Link>

              <span>·</span>

              {user._id === currentUserId ? (
                <div className="relative inline-block">
                  <div
                    onClick={() => setpostSelectedOpen(!postSelectedOpen)}
                    className="flex items-center  gap-2 rounded-full  px-3 py-1 cursor-pointer"
                  >
                    {(() => {
                      const selected = options.find(
                        (o) => o.value === postPrivacy,
                      );
                      const Icon = selected?.icon;

                      return (
                        <>
                          {Icon && <Icon size={12} />}
                          <span>{selected?.label}</span>
                        </>
                      );
                    })()}

                    <FaChevronDown
                      size={10}
                      className={`transition-transform ${postSelectedOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {postSelectedOpen && (
                    <div className="absolute left-0 mt-2 bg-card dark:bg-card-dark border border-border dark:border-border-dark  shadow rounded-lg overflow-hidden z-50">
                      {options.map((opt) => {
                        const Icon = opt.icon;

                        return (
                          <div
                            key={opt.value}
                            onClick={() => {
                              const newValue = opt.value;
                              setPostPrivacy(newValue);
                              setpostSelectedOpen(false);
                              editPrivacyPostMutation.mutate({
                                _id: post._id,
                                privacy: newValue,
                              });
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-hover dark:hover:bg-hover-dark cursor-pointer"
                          >
                            <Icon size={12} />
                            {opt.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-1 text-xs text-text-muted">
                    {(() => {
                      const selected = options.find(
                        (o) => o.value === postPrivacy,
                      );
                      const Icon = selected?.icon;

                      return (
                        <>
                          {Icon && <Icon size={12} />}
                          <span>{selected?.label}</span>
                        </>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              onClick={() => savePostMutation.mutate(_id)}
              disabled={savePostMutation.isPending}
              className="bg-transparent hover:bg-hover dark:hover:bg-hover-dark rounded-full p-2 transition"
            >
              {savePostMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : post.bookmarked ? (
                <FaBookmark className="w-4 h-4 text-blue-600" />
              ) : (
                <FaRegBookmark className="w-4 h-4" />
              )}
            </Button>

            {user._id === currentUserId && (
              <div className="relative">
                <Button
                  onClick={() => setOpenMenuId(openMenuId === _id ? null : _id)}
                  className="bg-transparent  text-text-muted dark:text-text-muted-dark hover:bg-hover dark:hover:bg-hover-dark rounded-full p-2"
                >
                  <FaEllipsisH className="w-4 h-4" />
                </Button>
                {openMenuId === _id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-50">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full text-left cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => deletePostMutation.mutate(_id)}
                      className=" w-full cursor-pointer text-left px-3 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center gap-2"
                    >
                      <MdDeleteOutline /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TEXT */}
        {(body || isEditing) && (
          <div className="mt-3">
            {isEditing ? (
              <>
                <textarea
                  maxLength={5000}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[#1877f2]/20 focus:border-[#1877f2] focus:ring-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />

                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() =>
                      editPostMutation.mutate({
                        _id: post._id,
                        body: editedContent,
                      })
                    }
                    disabled={!editedContent?.trim()}
                    className="rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text dark:text-text-dark">
                {body}
              </p>
            )}
          </div>
        )}
      </div>

      {/* IMAGE */}
      {image && (
        <div className="overflow-hidden border-y border-border dark:border-border-dark">
          <img
            src={image}
            alt="post"
            className="w-full max-h-[450px] object-contain"
          />
        </div>
      )}

      {/* SHARED POST */}
      {sharedPost && (
        <div className="mx-4 my-3 rounded-xl border border-border dark:border-border-dark bg-hover dark:bg-hover-dark p-3">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={sharedPost.user?.photo}
              alt="profile"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="flex flex-col text-start">
              <h3 className="font-bold text-sm text-text dark:text-text-dark">
                <Link
                  to={`/profile/${sharedPost.user?._id}`}
                  className="hover:underline"
                >
                  {sharedPost.user?.name}
                </Link>
              </h3>

              <div className="flex items-center gap-1 text-xs text-text-muted dark:text-text-muted-dark">
                <Link
                  to={`/posts/${sharedPost._id}`}
                  className="hover:underline"
                >
                  {formatSmartDate(sharedPost.createdAt)}
                </Link>

                <span>·</span>

                <FaGlobeAmericas size={11} />
                {sharedPost.privacy}
              </div>
            </div>
          </div>

          {sharedPost.body && (
            <p className="text-sm text-text dark:text-text-dark whitespace-pre-wrap">
              {sharedPost.body}
            </p>
          )}

          {sharedPost.image && (
            <div className="overflow-hidden border-y border-border dark:border-border-dark mt-2">
              <img
                src={sharedPost.image}
                alt="post"
                className="w-full max-h-[400px] object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* STATS */}
      <div className="px-4 pb-2 pt-3 text-sm text-text-muted dark:text-text-muted-dark">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
              <FaThumbsUp size={10} />
            </span>

            <button
              onClick={() => setOpen(true)}
              className=" cursor-pointer hover:text-primary hover:underline"
            >
              <span className="font-semibold">{likesCount || 0} likes</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              <FiRepeat />
              {sharesCount || 0} shares
            </span>

            <span>{commentsCount || 0} comments</span>
          </div>
        </div>
      </div>

      <div className="mx-4 border-t border-border dark:border-border-dark"></div>

      {/* ACTIONS */}
      <div className="grid grid-cols-3 gap-1 p-1 text-sm">
        <Button
          onClick={() => handleLike.mutate(post.id)}
          disabled={handleLike.isPending}
          className={`flex items-center justify-center gap-2 py-3 transition
  disabled:opacity-50
  ${
    isLiked
      ? "bg-blue-600/40 text-white hover:bg-blue-700/65"
      : "bg-transparent text-text-muted dark:text-text-muted-dark hover:bg-hover dark:hover:bg-hover-dark"
  }
  `}
        >
          {handleLike.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              Loading...
            </>
          ) : isLiked ? (
            <>
              <FaThumbsUp /> Liked{" "}
            </>
          ) : (
            <>
              <FaThumbsUp /> Like
            </>
          )}
        </Button>
        <Button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center justify-center gap-2 py-3 bg-transparent text-text-muted dark:text-text-muted-dark hover:bg-hover dark:hover:bg-hover-dark transition"
        >
          <FaRegCommentDots /> Comment
        </Button>
        <Button
          onClick={() => {
            setSelectedPost(post);
            setIsShareOpen(true);
          }}
          className="flex items-center justify-center gap-2 py-3 
  bg-transparent text-text-muted dark:text-text-muted-dark 
  hover:bg-hover dark:hover:bg-hover-dark transition"
        >
          <FaShareAlt /> Share
        </Button>
      </div>

      {/* Top Comment */}
      {showComments ? (
        <AllComponent ComponentData={_id} />
      ) : topComment ? (
        <div className="mx-4 mb-4 rounded-2xl border border-border dark:border-border-dark bg-hover dark:bg-hover-dark p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            Top Comment
          </p>

          <div className="flex items-start gap-2">
            <img
              src={topComment.commentCreator.photo}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />

            <div className="flex-1 rounded-2xl bg-card dark:bg-card-dark px-3 py-2">
              <p className="text-xs font-bold text-text dark:text-text-dark ">
                {topComment.commentCreator.name}
              </p>

              {topComment?.commentCreator?.username && (
                <p className="text-xs font-bold text-text-muted">
                  @{topComment.commentCreator.username}
                </p>
              )}

              <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
                {topComment.content}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="mt-2 text-xs font-bold cursor-pointer text-primary hover:underline"
          >
            View all comments
          </button>
        </div>
      ) : (
        <p className="text-center text-text-muted dark:text-text-muted-dark text-sm">
          No comments yet.
        </p>
      )}

      {/*Share Open */}

      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-[560px] rounded-2xl 
      border border-border dark:border-border-dark
      bg-card dark:bg-card-dark shadow-2xl
      animate-fadeIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border dark:border-border-dark px-4 py-3">
              <h4 className="text-base font-extrabold text-text dark:text-text-dark">
                Share post
              </h4>

              <button
                onClick={() => setIsShareOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center
          text-text-muted dark:text-text-muted-dark
          hover:bg-hover dark:hover:bg-hover-dark transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3 p-4">
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    handleShare.mutate({
                      postId: selectedPost.id,
                      body: shareText,
                    });
                  }
                }}
                disabled={handleShare.isPending}
                placeholder="Say something about this..."
                rows={3}
                className="w-full resize-none rounded-xl border border-border dark:border-border-dark
  bg-bg dark:bg-bg-dark
  px-3 py-2 text-sm text-text dark:text-text-dark
  outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />

              {/* Post preview */}
              <div className="rounded-xl border border-border dark:border-border-dark bg-hover dark:bg-hover-dark p-3">
                {/* user info */}
                <div className="flex items-center gap-2">
                  <img
                    src={selectedPost?.user?.photo}
                    className="h-8 w-8 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm font-bold text-text dark:text-text-dark">
                      {selectedPost?.user?.name}
                    </p>

                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      @{selectedPost?.user?.username}
                    </p>
                  </div>
                </div>

                {/* body */}
                <p className="mt-2 text-sm text-text dark:text-text-dark">
                  {selectedPost?.body}
                </p>

                {/* image */}
                {selectedPost?.image && (
                  <img
                    src={selectedPost.image}
                    className="mt-2 max-h-[220px] w-full rounded-lg object-cover"
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border dark:border-border-dark px-4 py-3">
              <Button
                onClick={() => setIsShareOpen(false)}
                className="rounded-lg border border-border dark:border-border-dark 
          px-4 py-2 text-sm font-bold text-text dark:text-text-dark 
          hover:bg-hover dark:hover:bg-hover-dark transition"
              >
                Cancel
              </Button>

              <Button
                onClick={() =>
                  handleShare.mutate({
                    postId: selectedPost.id,
                    body: shareText,
                  })
                }
                disabled={handleShare.isPending || !shareText.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {handleShare.isPending ? (
                  <>
                    Sharing...{" "}
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  </>
                ) : (
                  "Share now"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AllLikesModal
        isOpen={open}
        onClose={() => setOpen(false)}
        likesData={_id}
      />
    </div>
  );
}
