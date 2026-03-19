import { useState } from "react";
import Community from "./Community";
import Feed from "./Feed";
import MyPosts from "./MyPosts";
import Saved from "./Saved";
import PostComposer from "./PostComposer";
import SidebarMenu from "./SidebarMenu";
import SuggestedFriends from "./SuggestedFriends";

export default function Home() {
  const [activeTab, setActiveTab] = useState("feed");

  function renderContent() {
    switch (activeTab) {
      case "feed":
        return <Feed />;
      case "community":
        return <Community />;
      case "myposts":
        return <MyPosts />;
      case "saved":
        return <Saved />;
      default:
        return <Feed />;
    }
  }

  return (
    <div className="bg-bg dark:bg-bg-dark  ">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6 container w-full mx-auto max-w-7xl">

        {/* Left */}
        <div className="lg:col-span-1 ">
          <div className=" h-fit sticky top-20">
            <SidebarMenu
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* Middle */}
        <div className="lg:col-span-2 mx-auto w-full max-w-4xl">
          <PostComposer />
          {renderContent()}
        </div>

        {/* Right */}
        <div className="lg:col-span-1">
          <div className=" h-fit sticky top-20">
            <SuggestedFriends />
          </div>
        </div>

      </div>
    </div>
  );
}