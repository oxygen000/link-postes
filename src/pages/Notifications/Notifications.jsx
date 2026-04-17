import { FaCheck, FaRegComment, FaShare } from "react-icons/fa";
import { useContext } from "react";
import { authContext } from "./../../context/AuthContextProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CardLoding from "../../components/LodingSk/CardLoding";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import LoadingPage from "../../components/Loading/LoadingPage";

export default function Notifications() {
  let { token } = useContext(authContext);

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

  function getNotificationText(type) {
    switch (type) {
      case "like_post":
        return "liked your post";
      case "share_post":
        return "shared your post";
      case "comment_post":
        return "commented on your post";
      default:
        return "interacted with your post";
    }
  }

  function getIcon(type) {
    switch (type) {
      case "like_post":
        return <CiHeart className="text-red-500" />;
      case "share_post":
        return <FaShare className="text-green-500" />;
      case "comment_post":
        return <FaRegComment className="text-blue-500" />;
      default:
        return <CiHeart />;
    }
  }

  async function getNotifications() {
    return axios.get(
      "https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10",
      {
        headers: { token },
      },
    );
  }

  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryFn: getNotifications,
    queryKey: ["notifications"],
    select: (res) => res.data.data.notifications,
  });

  if (isLoading) return <LoadingPage />;

  if (isError)
    return (
      <p className="text-center mt-5 text-red-500">Something went wrong...</p>
    );

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main>
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sm:rounded-2xl">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-5 flex flex-wrap justify-between items-start gap-3">
            <div>
              <h2 className="text-xl font-black sm:text-2xl">Notifications</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Realtime updates for likes, comments, shares, and follows.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition w-full sm:w-auto">
              <FaCheck />
              Mark all as read
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 sm:items-center">
            <button className="rounded-full px-4 py-1.5 text-sm font-bold bg-blue-500 text-white hover:bg-blue-600 transition">
              All
            </button>
            <button className="rounded-full px-4 py-1.5 text-sm font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              Unread
              <span className="rounded-full px-2 py-0.5 text-xs bg-white dark:bg-gray-800 text-blue-500">
                {notifications.length}
              </span>{" "}
            </button>
          </div>

          <div className="space-y-2 p-3 sm:p-4">
            {notifications.map((notification) => (
              <>
                <Link
                  key={notification._id}
                  to={`/notifications/${notification._id}`}
                  className="block"
                >
                  <article className="group relative flex gap-3 rounded-xl border p-3 sm:rounded-2xl sm:p-4 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900">
                    <div className="relative shrink-0">
                      <Link
                        to={`/profile/${notification.actor._id}`}
                        className="block cursor-pointer"
                      >
                        <img
                          alt={notification.actor.name}
                          src={notification.actor.photo}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      </Link>
                      <span className="absolute bottom-5 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-gray-800 ring-2 ring-white dark:ring-gray-900">
                        {getIcon(notification.type)}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <p className="text-sm leading-6">
                          <Link
                            to={`/profile/${notification.actor._id}`}
                            className="font-extrabold hover:text-blue-500 dark:hover:text-blue-400 hover:underline"
                          >
                            {notification.actor.name}
                          </Link>{" "}
                          {getNotificationText(notification.type)}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {formatSmartDate(notification.createdAt)}
                          </span>
                          <span className="text-blue-500 dark:text-blue-400 text-xs">
                            •
                          </span>
                        </div>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                        {notification.entity.body}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button className="inline-flex items-center cursor-pointer gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800 transition">
                          <FaCheck /> Mark as read
                        </button>
                      </div>
                    </div>
                  </article>
                </Link>
              </>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
