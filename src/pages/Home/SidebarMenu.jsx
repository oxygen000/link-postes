import { FaRegNewspaper, FaRegBookmark } from "react-icons/fa6";
import { LuEarth } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi";

export default function SidebarMenu({ activeTab, setActiveTab }) {

  const baseStyle =
    "mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition cursor-pointer";

  const inactiveStyle =
    "text-text dark:text-text-dark hover:bg-hover dark:hover:bg-hover-dark";

  const activeStyle =
    "bg-primary/10 text-primary";

  return (
    <div
      className="rounded-2xl border border-border dark:border-border-dark 
                 bg-card dark:bg-card-dark p-3 shadow-sm"
    >

      <button
        onClick={() => setActiveTab("feed")}
        className={`${baseStyle} ${
          activeTab === "feed" ? activeStyle : inactiveStyle
        }`}
      >
        <FaRegNewspaper size={17} />
        Feed
      </button>

      <button
        onClick={() => setActiveTab("myposts")}
        className={`${baseStyle} ${
          activeTab === "myposts" ? activeStyle : inactiveStyle
        }`}
      >
        <HiOutlineSparkles size={17} />
        My Posts
      </button>

      <button
        onClick={() => setActiveTab("community")}
        className={`${baseStyle} ${
          activeTab === "community" ? activeStyle : inactiveStyle
        }`}
      >
        <LuEarth size={17} />
        Community
      </button>

      <button
        onClick={() => setActiveTab("saved")}
        className={`${baseStyle} ${
          activeTab === "saved" ? activeStyle : inactiveStyle
        }`}
      >
        <FaRegBookmark size={17} />
        Saved
      </button>

    </div>
  );
}