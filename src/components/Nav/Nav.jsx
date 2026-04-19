import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
  Avatar,
} from "@heroui/react";
import { FcAddressBook } from "react-icons/fc";
import { authContext } from "../../context/AuthContextProvider";
import { AiOutlineHome } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import ThemeSwitcher from "./../ThemeSwitcher";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Nav() {
  const { token, setToken, user } = useContext(authContext);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  async function getNotifications() {
    return axios.get(
      "https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10",
      {
        headers: { token },
      },
    );
  }

  const { data: notifications = [] } = useQuery({
    queryFn: getNotifications,
    queryKey: ["notifications"],
    select: (res) => res.data.data.notifications,
  });

  return (
    <>
      <Navbar className="bg-bg dark:bg-bg-dark border-b border-border dark:border-border-dark">
        <NavbarContent>
          <NavbarBrand>
            <Link to="/" className="flex items-center gap-2 text-inherit">
              <FcAddressBook className="text-5xl" />
              <p className="font-bold text-text dark:text-text-dark">
                Linked Post
              </p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <div className="flex items-center gap-4 p-2 rounded-4xl border border-border dark:border-border-dark">
            <NavbarItem>
              <Link to="/">
                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-2 transition
                  ${
                    location.pathname === "/"
                      ? "bg-card-hover text-primary dark:text-primary-hover"
                      : "text-text dark:text-text-dark hover:text-primary-hover "
                  }`}
                >
                  <AiOutlineHome />
                  Home
                </div>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/profile">
                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-2 transition
                  ${
                    location.pathname === "/profile"
                      ? "bg-card-hover text-primary dark:text-primary-hover"
                      : "text-text dark:text-text-dark hover:text-primary-hover"
                  }`}
                >
                  <FaRegUser />
                  Profile
                </div>
              </Link>
            </NavbarItem>

            <NavbarItem>
  <Link to="/notifications">
    <div
      className={`flex items-center gap-1 rounded-full px-3 py-2 transition
      ${
        location.pathname === "/notifications"
          ? "bg-card-hover text-primary dark:text-primary-hover"
          : "text-text dark:text-text-dark hover:text-primary-hover"
      }`}
    >
      <div className="relative">
        <IoChatbubbleOutline />

        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-1.5 bg-blue-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </div>

      Notifications
    </div>
  </Link>
</NavbarItem>
          </div>
        </NavbarContent>

        {token ? (
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center gap-2 border border-border dark:border-border-dark px-3 py-1.5 rounded-full cursor-pointer hover:bg-hover dark:hover:bg-hover-dark transition">
                  <Avatar
                    isBordered
                    className="transition-transform"
                    color="secondary"
                    name={user?.name}
                    size="sm"
                    src={user?.photo}
                  />
                  <span className="text-text dark:text-text-dark text-sm font-medium hidden sm:inline-block">
                    {user?.name}
                  </span>
                  <RxHamburgerMenu className="text-text dark:text-text-dark text-sm hidden sm:inline-block" />
                </div>
              </DropdownTrigger>

              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profileName"
                  className="h-14 gap-2 cursor-auto "
                  textValue={user?.email}
                >
                  <p className="font-semibold text-text dark:text-text-dark">
                    {user?.email}
                  </p>
                </DropdownItem>
                <DropdownItem
                  as={Link}
                  to={"/profile"}
                  key="profile"
                  className="text-text dark:text-text-dark"
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  as={Link}
                  key="settings"
                  to={"/settings"}
                  className="text-text-muted dark:text-text-muted-dark"
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem>
              <Link className="text-text dark:text-text-dark" to="/login">
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" to="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}
        <ThemeSwitcher />
      </Navbar>
    </>
  );
}
