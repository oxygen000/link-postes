import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import PostCard from "../Home/PostCard";
import { useContext } from "react";
import { authContext } from "../../context/AuthContextProvider";
import  axios  from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from "react-router-dom";


export default function ProfilePage() {

   let { token } = useContext(authContext);
   let { id  } = useParams();



  async function getProfile() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${id}/profile`,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  let {
    data: userdata = [],
    isLoading,
    isError,
  } = useQuery({
    queryFn: getProfile,
    queryKey: [`MyProfileUser${id}`],
    select: (res) => res.data.data.user,
  });
  if (isLoading) return <>
  <p>
    loding...
  </p>
  </>

  if (isError)
    return (
      <p className="text-center mt-5 text-red-500">Something went wrong...</p>
    );

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5 bg-slate-50">
      <main className="min-w-0">
        <div className="space-y-4">
          {/* Back Button */}
          <Link to={"/"} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100">
            <FaArrowLeft />
            Back
          </Link>

          {/* Profile Header */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
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
              <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-white/70 bg-white/95 p-4">
                <div className="flex items-end gap-3">
                  <img
                    alt={userdata.name}
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm sm:h-24 sm:w-24"
                    src={userdata.photo}
                  />
                  <div>
                    <p className="text-xl font-black text-slate-900 sm:text-2xl">
                      {userdata.name}
                    </p>
                    <p className="text-sm font-semibold text-slate-500 sm:text-base">
                      @{userdata.username}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  <FaUserPlus />
                  Follow
                </button>
              </div>
            </div>
          </section>

          {/* Posts Section */}
          {/* <section className="space-y-3">
            {posts && posts.length > 0 ? (
              posts.map(
                (post) => post && <PostCard key={post.id} post={post} />,
              )
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                No posts yet. Be the first one to publish.
              </div>
            )}
          </section> */}
        </div>
      </main>
    </div>
  );
};

