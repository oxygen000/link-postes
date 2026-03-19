import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { authContext } from './../../context/AuthContextProvider';
import { useContext } from "react"
import PostCard from "./PostCard";
import CardLoding from "../../components/LodingSk/CardLoding";




export default function Saved() {

  let { token } = useContext(authContext);

  async function getSavedPosts() {
    return axios.get(
      "https://route-posts.routemisr.com/users/bookmarks",
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
    queryFn: getSavedPosts,
    queryKey: ["savedPosts"],
    select: (res) => res.data.data.bookmarks,
  });
  

  if (isLoading) return <CardLoding />;

  if (isError)
    return (
      <p className="text-center mt-5 text-red-500">
        Something went wrong...
      </p>
    );
  
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