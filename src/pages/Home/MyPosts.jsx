import { useContext } from "react";
import { authContext } from "../../context/AuthContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CardLoding from "../../components/LodingSk/CardLoding";
import PostCard from "./PostCard";



export default function MyPosts({ MyPosts = [] }) {

   let { token } = useContext(authContext);

  async function getMyPosts() {
    return axios.get(
      "https://route-posts.routemisr.com/posts/feed?only=following&limit=10",
      {
        headers: { token },
      }
    );
  }

  const {
    data: posts = [],  
    isLoading,
    isError,
  } = useQuery({
    queryFn: getMyPosts,
    queryKey: ["MyPosts"],
    select: (res) => res.data.data.posts,
  });

  if (isLoading) return <CardLoding />;

  if (isError)
    return (
      <p className="text-center mt-5 text-red-500">
        Something went wrong...
      </p>
    );

 if (!MyPosts.length) {
    return (
      <div className="mt-4 rounded-2xl border border-border dark:border-border-dark 
                      bg-card dark:bg-card-dark 
                      p-10 text-center text-text-muted dark:text-text-muted-dark shadow-sm">
        No posts yet. Be the first one to publish.
      </div>
    );
  }


  
  return (
    <>
    {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <p className="text-center text-text-muted dark:text-text-muted-dark mt-5 text-lg bg-white dark:bg-bg-dark p-4 rounded-lg shadow-sm py-5">
              No posts yet. Be the first one to publish.
            </p>
          )}
          <p className="text-center text-text-muted dark:text-text-muted-dark mt-5 text-sm">
            You reached the end
           </p>
    </>
  )
}
