import { useMutation, useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaSearch, FaUserPlus, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import  axios  from 'axios';
import { authContext } from "../../context/AuthContextProvider";
import { useContext, useState } from "react";
import {Button, Skeleton} from "@heroui/react";


export default function Suggestions() {
    let { token }   = useContext(authContext);
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
  
   async function SuggestedFriends() {
    return axios.get(
      "https://route-posts.routemisr.com/users/suggestions?limit=20",
      {
        headers: {
          token: token,
        },
      },
    );
  }

  let {
    data: suggestions = [],
    isLoading,
    isError,
  } = useQuery({
    queryFn: SuggestedFriends,
    queryKey: ["SuggestedFriendsPage"],
    select: (res) => res.data.data.suggestions,
  });

    if (isLoading) {
      return (
        <>
        <div className="max-w-[300px] w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
        </>
      );
    }

  if (isError) {
    return <h2>Error...</h2>;
  }
  return (
    <>
<main className="mt-4 mx-auto max-w-5xl px-5  min-h-screen">
     <div className="flex  items-start justify-start gap-4 ">
        <Link to={"/"} className="inline-flex bg-bg dark:bg-bg-dark border-border dark:border-border-dark text-text dark:text-text-dark border  cursor-pointer items-center gap-2 rounded-lg   px-3 py-2 text-sm font-bold  transition ">
            <FaArrowLeft />
            Back
          </Link>
      </div>
      <div className="gap-4 mt-4   border border-border dark:border-border-dark rounded-lg bg-card dark:bg-card-dark p-4"> 

       <div className="flex items-center  justify-between gap-2">
         <h3 className="text-2xl font-bold text-primary flex items-center gap-2"> <FaUsers/> All Suggested Friends</h3>
          <span
          className="rounded-full bg-hover dark:bg-hover-dark 
                         px-2 py-0.5 text-xs font-bold 
                         text-text-muted dark:text-text-muted-dark"
        >
          {suggestions.length}
        </span>
       </div>

        <div className="my-4">
                <div className="relative">
                  <FaSearch
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark"
                  />
                  <input
                    placeholder="Search friends..."
                    className="w-full rounded-xl border border-border dark:border-border-dark
                               bg-hover dark:bg-hover-dark
                               py-2 pl-9 pr-3 text-sm
                               text-text dark:text-text-dark
                               outline-none
                               focus:border-primary
                               focus:bg-card dark:focus:bg-card-dark"
                  />
                </div>
              </div>


<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
  {suggestions.map((users) => (
        <div
          key={users._id}
          className="rounded-xl border border-border dark:border-border-dark p-2.5 mb-3"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="flex  min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition "
            >
              <img
  src={users.photo}
  alt={users.name}
  className="h-10 w-10 min-w-10 rounded-full object-cover"
/>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/${users._id}`}
                  className="block truncate text-sm font-bold text-text dark:text-text-dark hover:underline"
                >
                  {users.name}
                </Link>
                <p className="truncate text-xs text-text-muted dark:text-text-muted-dark">
                  {users.username}
                </p>
              </div>
            </button>

            <button
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5
              text-xs font-bold transition cursor-pointer
              ${
                followingIds.includes(users._id)
                  ? "bg-gray-200 text-gray-700"
                  : "bg-primary/10 text-primary"
              }`}
              onClick={() => toggleFollow(users._id)}
              disabled={loadingId === users._id}
            >
              {loadingId === users._id ? (
                "Loading..."
              ) : followingIds.includes(users._id) ? (
                "Unfollow"
              ) : (
                <>
                  <FaUserPlus size={13} /> Follow
                </>
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-text-muted dark:text-text-muted-dark">
            <span className="rounded-full bg-hover dark:bg-hover-dark px-2 py-0.5">
              {users.followersCount} followers
            </span>
          </div>
        </div>
      ))}

      
        </div>
        <Button
        className="mt-3 inline-flex w-full items-center justify-center gap-2
                   rounded-xl border border-border dark:border-border-dark
                   bg-hover dark:bg-hover-dark
                   px-3 py-2 text-sm font-bold
                   text-text dark:text-text-dark
                   transition hover:bg-border dark:hover:bg-border-dark"
                   
      >
        View more
      </Button>
      </div>

        </main>
    </>
  )
}
