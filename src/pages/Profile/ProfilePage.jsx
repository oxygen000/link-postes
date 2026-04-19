import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import PostCard from "../Home/PostCard";
import { useContext, useState } from "react";
import { authContext } from "../../context/AuthContextProvider";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import LoadingPage from "../../components/Loading/LoadingPage";
import { FaUserMinus } from "react-icons/fa6";

export default function ProfilePage() {
  let { token } = useContext(authContext);
  let { id } = useParams();
  const [followingIds, setFollowingIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const { mutate: toggleFollow } = useMutation({
    mutationFn: (userId) =>
      axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers: { token } },
      ),

    onMutate: (userId) => {
      setLoadingId(userId);

      setFollowingIds((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId],
      );
    },

    onSettled: () => {
      setLoadingId(null);
    },
  });

  async function getProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
      headers: {
        token: token,
      },
    });
  }
  let {
    data: userdata = [],
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryFn: getProfile,
    queryKey: [`MyProfileUser${id}`],
    select: (res) => res.data.data.user,
  });

  async function getPostProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/posts`, {
      headers: {
        token: token,
      },
    });
  }
  let {
    data: userdatapost = [],
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useQuery({
    queryFn: getPostProfile,
    queryKey: [`MyProfilePost${id}`],
    select: (res) => res.data.data.posts,
  });
  const isLoading = isProfileLoading || isPostsLoading;
  const isError = isProfileError || isPostsError;

  if (isLoading) return <LoadingPage />;

  if (isError)
    return (
      <p className="text-center mt-5 text-red-500">Something went wrong...</p>
    );

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5 bg-bg dark:bg-bg-dark">
      <main className="min-w-0">
        <div className="space-y-4">
          {/* Back Button */}
          <Link
            to={"/"}
            className="mb-3 w-[80px] flex items-center gap-2 rounded-lg border border-border dark:border-border-dark  bg-bg dark:bg-bg-dark px-3 py-2 text-sm font-bold text-text-muted hover:bg-hover"
          >
            <FaArrowLeft size={14} />
            Back
          </Link>

          {/* Profile Header */}
          <section className="overflow-hidden rounded-2xl border shadow-sm  bg-bg dark:bg-bg-dark border-border dark:border-border-dark">
            <div className="h-48 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600">
              {userdata.cover && (
                <img
                  alt={userdata.name}
                  src={userdata.cover}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="relative -mt-14 px-3 pb-5 sm:px-5">
              <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border bg-bg dark:bg-bg-dark border-border dark:border-border-dark text-text dark:text-text-dark p-4">
                <div className="flex items-end gap-3">
                  <img
                    alt={userdata.name}
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm sm:h-24 sm:w-24"
                    src={userdata.photo}
                  />
                  <div>
                    <p className="text-xl font-black  sm:text-2xl">
                      {userdata.name}
                    </p>
                    <p className="text-sm font-semibold text-text-muted dark:text-text-muted-dark sm:text-base">
                      @{userdata.username}
                    </p>
                  </div>
                </div>
                <button
                  className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold  transition ease-in-out"

              ${
                followingIds.includes(userdata._id)
                  ? "bg-gray-200 text-text hover:bg-blue-700/90"
                  : "bg-primary/10 text-text-dark hover:bg-blue-600"
              }`}
                  onClick={() => toggleFollow(userdata._id)}
                  disabled={loadingId === userdata._id}
                >
                  {loadingId === userdata._id ? (
                    "Loading..."
                  ) : followingIds.includes(userdata._id) ? (
                    <>
                      <FaUserMinus size={13} />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <FaUserPlus size={13} /> Follow
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Posts Section */}
          <section className="space-y-3">
            {userdatapost && userdatapost.length > 0 ? (
              userdatapost.map(
                (post) => post && <PostCard key={post.id} post={post} />,
              )
            ) : (
              <div className="rounded-2xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark p-10 text-center text-text-muted dark:text-text-muted-dark shadow-sm">
                No posts yet. Be the first one to publish.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
