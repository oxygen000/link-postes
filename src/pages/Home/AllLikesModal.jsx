import { useContext } from "react";
import { FaUsers, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { authContext } from "../../context/AuthContextProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function AllLikesModal({ isOpen, onClose, likesData }) {
  if (!isOpen) return null;

  let { token } = useContext(authContext);

  async function getLinksModal() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${likesData}/likes?page=1&limit=20`,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  let {
    data: likes = [],
    isLoading,
    isError,
  } = useQuery({
    queryFn: getLinksModal,
    queryKey: ["LinksModal", likesData],
    select: (res) => res.data.data.likes,
  });

  if (isLoading)
    return (
      <>
        <div className="fixed inset-0 z-[71] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-[520px] rounded-2xl border border-border bg-card dark:bg-card-dark shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-border dark:border-border-dark px-4 py-3">
              <div className="flex items-center gap-2">
                <FaUsers className="text-primary text-lg" />

                <h4 className="text-base font-extrabold text-text dark:text-text-dark">
                  People who reacted
                </h4>
              </div>

              <button
                onClick={onClose}
                className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-full text-text-muted dark:text-text-muted-dark transition hover:bg-hover dark:hover:bg-hover-dark"
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}
            <div className="max-h-[420px] overflow-y-auto px-2 py-2">
              <div className="flex items-center gap-2 justify-center py-4">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </div>
            </div>
          </div>
        </div>
      </>
    );

  if (isError)
    return (
      <>
        <div className="fixed inset-0 z-[71] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-[520px] rounded-2xl border border-border bg-card dark:bg-card-dark shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-border dark:border-border-dark px-4 py-3">
              <div className="flex items-center gap-2">
                <FaUsers className="text-primary text-lg" />

                <h4 className="text-base font-extrabold text-text dark:text-text-dark">
                  People who reacted
                </h4>
              </div>

              <button
                onClick={onClose}
                className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-full text-text-muted dark:text-text-muted-dark transition hover:bg-hover dark:hover:bg-hover-dark"
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}
            <div className="max-h-[420px] overflow-y-auto px-2 py-2">
              <div className="space-y-1">
                <p className="text-center mt-5 text-red-500">
                  Something went wrong...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );

  return (
    <div className="fixed inset-0 z-[71] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[520px] rounded-2xl border border-border bg-card dark:bg-card-dark shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border dark:border-border-dark px-4 py-3">
          <div className="flex items-center gap-2">
            <FaUsers className="text-primary text-lg" />

            <h4 className="text-base font-extrabold text-text dark:text-text-dark">
              People who reacted
            </h4>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted dark:text-text-muted-dark transition hover:bg-hover dark:hover:bg-hover-dark"
          >
            <FaTimes />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-2 py-2">
          <div className="space-y-1">
            {likes?.map((like) => (
              <Link
                key={like._id}
                to={`/profile/${like._id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-hover dark:hover:bg-hover-dark"
              >
                <img
                  src={like.photo}
                  alt={like.name}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-text dark:text-text-dark">
                    {like.name}
                  </p>

                  <p className="truncate text-xs text-text-muted dark:text-text-muted-dark">
                    @{like.username}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
