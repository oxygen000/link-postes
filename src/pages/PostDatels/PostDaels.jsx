import {
  FaArrowLeft,
  FaGlobe,
  FaEllipsisH,
  FaThumbsUp,
  FaRegComment,
  FaShare,
} from "react-icons/fa";
import PostCard from "../Home/PostCard";
import axios from "axios";
import { useContext } from "react";
import { authContext } from "../../context/AuthContextProvider";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import LoadingPage from "../../components/Loading/LoadingPage";

export default function PostDaels() {
  let { token } = useContext(authContext);
  let { id } = useParams();

  async function getDataPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: token,
      },
    });
  }

  let {
    data: post = [],
    isLoading,
    isError,
  } = useQuery({
    queryFn: getDataPost,
    queryKey: ["DataPost"],
    select: (res) => res.data.data.post,
  });

  if (isLoading)
    return (
      <>
        <LoadingPage/>
      </>
    );

  if (isError)
    return (
      <p className="text-center mt-5 text-red-500">Something went wrong...</p>
    );

  return (
    <div className="mx-auto max-w-7xl bg-bg dark:bg-bg-dark px-3 py-4">
      <main className="mx-auto max-w-3xl">
        <Link to={"/"} className="mb-3 w-[80px] flex items-center gap-2 rounded-lg border border-border dark:border-border-dark  bg-bg dark:bg-bg-dark px-3 py-2 text-sm font-bold text-text-muted hover:bg-hover">
          <FaArrowLeft size={14} />
          Back
        </Link>

        <article className="overflow-visible rounded-xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark shadow-sm">
          <PostCard key={post._id} post={post} />
        </article>
      </main>
    </div>
  );
}
