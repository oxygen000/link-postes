import { FaCamera, FaUsers, FaExpand } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { FaRegFileAlt, FaBookmark } from "react-icons/fa";
import { useContext, useState } from "react";
import { authContext } from "./../../context/AuthContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaCalendarDay } from "react-icons/fa";
import LoadingPage from "../../components/Loading/LoadingPage";


export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  let { token } = useContext(authContext);

   async function getMyPosts() {
    return axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      {
        headers: {
          token: token,
        },
      },
    );
  }
   let {
    data: posts = []
  } = useQuery({
    queryFn: getMyPosts,
    queryKey: ["MyPosts"],
    select: (res) => res.data.data.posts,
  });

  async function getProfile() {
    return axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      {
        headers: {
          token: token,
        },
      },
    );
  }
  
  
  let {
    data: user = [],
    isLoading,
    isError,
  } = useQuery({
    queryFn: getProfile,
    queryKey: ["MyProfile"],
    select: (res) => res.data.data.user,
  });
  
  if (isLoading) return (
    <LoadingPage/>
  )

  if (isError)
    return (
      <p className="text-center mt-5 text-red-500">Something went wrong...</p>
    );

  return (
    <>
      <div className="px-4 py-9   bg-bg dark:bg-bg-dark  ">
        <section className="mx-auto container max-w-6xl overflow-hidden rounded-3xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm">
          {/* Cover */}
          <div className="group relative h-49  bg-gradient-to-r from-primary to-primary-hover">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Add cover button (hover only) */}
            <label className="absolute top-4 right-4 hidden group-hover:inline-flex cursor-pointer items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/70">
              <FaCamera size={13} />
              Change cover
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          {/* Body */}
          <div className="relative -mt-16 px-6 pb-8">
            <div className="rounded-3xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-8">
              {/* Top Section */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                {/* User Info */}
                <div className="flex items-end gap-5">
                  {/* Avatar */}
                  <div className="group relative">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="h-32 w-32 rounded-full border-4 border-card dark:border-card-dark object-cover shadow-lg"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button className="h-9 w-9 flex items-center justify-center rounded-full bg-white text-primary shadow hover:scale-105 transition">
                        <FaExpand size={14} />
                      </button>

                      <label className="h-9 w-9 flex items-center justify-center rounded-full bg-primary text-white shadow hover:scale-105 transition cursor-pointer">
                        <FaCamera size={14} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="pb-3">
                    <h2 className="text-3xl font-extrabold text-text dark:text-text-dark">
                      {user.name}
                    </h2>
                    <p className="text-text-muted dark:text-text-muted-dark font-medium">
                      @{user.username}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <FaUsers size={12} />
                      Route Posts Member
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 w-full lg:w-[520px]">
                  <Stat title="Followers" number={user.followersCount} />
                  <Stat title="Following" number={user.followingCount} />
                  <Stat title="Bookmarks" number={user.bookmarksCount} />
                </div>
              </div>

              {/* Bottom Section */}
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
                {/* About */}
                <div className="rounded-2xl border border-border dark:border-border-dark bg-hover dark:bg-hover-dark p-5">
                  <h3 className="text-sm font-bold text-text dark:text-text-dark">
                    About
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-text-muted dark:text-text-muted-dark">
                    <p className="flex items-center gap-2">
                      <FiMail />
                      {user.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <FaUsers />
                      Active on Route Posts
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUsers />
                      Gender: {user.gender}
                    </p>
                    <p className="flex items-center gap-2">
  <FaCalendarDay />
  Birth Of: {new Date(user.dateOfBirth).toLocaleDateString()}
</p>
<p className="flex items-center gap-2">
  <FaUsers />
  Join : {new Date(user.createdAt).toLocaleDateString()}
</p>
                  </div>
                </div>

                {/* Mini Stats */}
                <div className="grid gap-4">
                  <MiniStat title="My posts" number={posts.length} />
                  <MiniStat title="Saved posts" number={user.bookmarksCount} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-5 mt-8 mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-3 shadow-sm">
            {/* Tabs */}
            <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-hover dark:bg-hover-dark p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
              {/* My Posts */}
              <button
                onClick={() => setActiveTab("posts")}
                className={`inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition
              ${
                activeTab === "posts"
                  ? "bg-card dark:bg-card-dark text-primary shadow-sm"
                  : "text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark"
              }`}
              >
                <FaRegFileAlt size={14} />
                My Posts
              </button>

              {/* Saved */}
              <button
                onClick={() => setActiveTab("saved")}
                className={`inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition
              ${
                activeTab === "saved"
                  ? "bg-card dark:bg-card-dark text-primary shadow-sm"
                  : "text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark"
              }`}
              >
                <FaBookmark size={14} />
                Saved
              </button>
            </div>

            {/* Counter */}
            <span className="rounded-full bg-primary/10 px-4 py-1 text-xs font-bold text-primary">
              0
            </span>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {activeTab === "posts" && (
              <p className="rounded-xl border border-border dark:border-border-dark bg-hover dark:bg-hover-dark p-5 text-sm text-text-muted dark:text-text-muted-dark">
                You have not posted yet.
              </p>
            )}

            {activeTab === "saved" && (
              <p className="rounded-xl border border-border dark:border-border-dark bg-hover dark:bg-hover-dark p-5 text-sm text-text-muted dark:text-text-muted-dark">
                You have no saved posts.
              </p>
            )}
          </div>
        </section>
      </div>
      
    </>
  );
}

function Stat({ title, number }) {
  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-5 text-center hover:shadow-md transition">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
        {title}
      </p>
      <p className="mt-1 text-3xl font-extrabold text-text dark:text-text-dark">
        {number}
      </p>
    </div>
  );
}

function MiniStat({ title, number }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4 hover:bg-primary/20 transition">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {title}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-text dark:text-text-dark">
        {number}
      </p>
    </div>
  );
}
