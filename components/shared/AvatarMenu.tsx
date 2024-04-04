"use client";
import { signOut } from "@/app/actions";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { avatarMenuItems } from "@/helpers/constants";
import { selectAuth } from "@/lib/features/auth/authSlice";
import { generateAvatarUrl } from "@/lib/utils";
import Link from "next/link";
import { FocusEvent, FormEvent } from "react";
import { useSelector } from "react-redux";

export default function AvatarMenu({ avatar }: { avatar: string }) {
  const authData = useSelector(selectAuth);

  // Open the menu when the user clicks on the avatar
  const handleClick = () => {
    const userMenu = document.getElementById("userMenu");

    if (userMenu) {
      userMenu.setAttribute("aria-expanded", "true");
    }
  };

  // Close the menu when the user clicks outside of it
  const handleBlur = (e: FocusEvent) => {
    const { relatedTarget } = e;
    const userMenu = document.getElementById("userMenu");

    if (relatedTarget?.classList?.contains("avatar-menu-item")) {
      setTimeout(() => {
        userMenu?.setAttribute("aria-expanded", "false");
      }, 150);
    } else {
      userMenu?.setAttribute("aria-expanded", "false");
    }
  };

  // Sign out the user
  const handleSignOut = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signOut();
      window.location.href = "/sign-in";
    } catch (error) {}
  };

  return (
    <div className="relative">
      <button onClick={handleClick} onBlur={handleBlur} id="avatarBtn">
        <Avatar>
          <AvatarImage src={generateAvatarUrl(avatar)} />
        </Avatar>
      </button>
      <menu
        className="absolute bg-white z-[99999] shadow right-0 rounded-md overflow-hidden border-2 border-secondary hidden [&[aria-expanded='true']]:block font-medium text-slate-700"
        id="userMenu"
        aria-expanded="false"
      >
        {avatarMenuItems.map((item, index) => (
          <li key={item.route}>
            <Link
              href={
                item.route === "/user"
                  ? `/user/${authData?.username}`
                  : item.route
              }
              className="block py-2 px-4 w-[200px] transition-colors hover:bg-secondary avatar-menu-item"
              key={index}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          <form onSubmit={handleSignOut}>
            <button
              className="py-2 px-4 w-[200px] transition-colors hover:bg-secondary text-left avatar-menu-item
              flex flex-col "
              type="submit"
            >
              <span className="text-black font-semibold">Sign out</span>
              <span className="text-sm">
                @
                {authData?.username?.length > 10
                  ? authData?.username?.slice(0, 10)
                  : authData?.username}
              </span>
            </button>
          </form>
        </li>
      </menu>
    </div>
  );
}
