import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { HeroUIProvider } from "@heroui/react";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Singup from "./pages/Singup/Singup";
import Layout from "./pages/Layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDaels from "./pages/PostDatels/PostDaels";
import LayoutAuth from "./pages/Layout/LayoutAuth";
import { ToastContainer } from "react-toastify";
import CounterContext from "./context/CounterContext";
import AuthContextProvider from "./context/AuthContextProvider";
import ProtectRoutes from "./components/ProtectRoutes/ProtectRoutes";
import Notifications from "./pages/Notifications/Notifications";
import ProfilePage from "./pages/Profile/ProfilePage";
import Profile from "./pages/Profile/Profile";
import Suggestions from "./pages/Suggestions/Suggestions";
import Settings from "./pages/Settings/Settings";

function App() {
  const queryClient = new QueryClient();

  let router = createBrowserRouter([
    {
      element: (
        <ProtectRoutes>
          <Layout />
        </ProtectRoutes>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "profile", element: <Profile /> },
        { path: "profile/:id", element: <ProfilePage /> },
        { path: "posts/:id", element: <PostDaels /> },
        { path: "notifications", element: <Notifications /> },
        { path: "suggestions", element: <Suggestions /> },
        { path: "settings", element: <Settings /> },
        { path: "*", element: <Home /> },
      ],
    },
    {
      element: <LayoutAuth />,
      children: [
        { path: "login", element: <Login /> },
        { path: "signup", element: <Singup /> },
      ],
    },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          <AuthContextProvider>
            <CounterContext>
              <RouterProvider router={router} />
              <ToastContainer />
            </CounterContext>
          </AuthContextProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
