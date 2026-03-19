import { MdOutlinePublic } from "react-icons/md";
import { authContext } from "../../context/AuthContextProvider";
import { useContext, useRef, useState } from "react";
import { CiImageOn, CiFaceSmile } from "react-icons/ci";
import { IoPaperPlaneOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";

export default function PostComposer() {
  const { user } = useContext(authContext);
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const [image, setImage] = useState(null);

  async function handleCreatePost() {
    try {
      const formData = new FormData();

      if (text) formData.append("body", text);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        "https://route-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      console.log(data);

      setText("");
      setImage(null);
      toast.success("Post Success ");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="rounded-2xl border  border-border dark:border-border-dark dark:bg-card-dark bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <img
          src={user?.photo}
          alt={user?.name}
          className="h-11 w-11 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-base text-start font-extrabold text-text dark:text-text-dark">
            {user?.name}
          </p>

          <div className="mt-1 flex items-center gap-2 rounded-full bg-card-hover px-2 py-0.5 text-xs font-semibold text-text-muted justify-start">
            <MdOutlinePublic className="w-4 h-4" />
            <select className="bg-transparent outline-none cursor-pointer">
              <option value="public">Public</option>
              <option value="following">Followers</option>
              <option value="only_me">Only me</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={4}
          placeholder={`What's on your mind, ${user?.name}`}
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-28 rounded-2xl border border-border dark:border-border-dark bg-card-hover px-4 py-3 text-[17px] leading-relaxed text-text dark:text-text-dark outline-none transition focus:border-color-primary focus:bg-card dark:focus:bg-card-dark resize-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border dark:border-border-dark pt-3">
        <div className="relative flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-muted transition hover:bg-card-hover">
            <CiImageOn className="w-5 h-5 text-emerald-500" />
            <span className="hidden sm:inline">Photo/video</span>
            <input accept="image/*" type="file" className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => textareaRef.current?.focus()}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-muted transition hover:bg-card-hover"
            title="Press Ctrl+Cmd+Space (Mac) or Win+. (Windows) to open emoji picker"
          >
            <CiFaceSmile className="w-5 h-5 text-amber-500" />
            <span className="hidden sm:inline">Emoji</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-color-primary-hover disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            disabled={!text.trim() && !image}
            onClick={handleCreatePost}
          >
            Post
            <IoPaperPlaneOutline className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
