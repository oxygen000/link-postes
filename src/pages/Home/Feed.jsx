import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { authContext } from './../../context/AuthContextProvider';
import { useContext } from "react"
import PostCard from "./PostCard";
import CardLoding from "../../components/LodingSk/CardLoding";



export default function Feed() {

  let { token } = useContext(authContext);

  async function getFeed() {
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
    queryFn: getFeed,
    queryKey: ["feed"],
    select: (res) => res.data.data.posts,
  });

  if (isLoading) return <CardLoding />;

  if (isError)
    return (
      <p className="text-center mt-5 text-red-500">
        Something went wrong...
      </p>
    );


     if (!posts.length) {
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
  );
}
