"use client";

import { selectAuth } from "@/lib/features/auth/authSlice";
import { useSelector } from "react-redux";
import AvatarMenu from "./AvatarMenu";
import { Button } from "../ui/button";
import Link from "next/link";

export default function AuthButtons() {
  const authData = useSelector(selectAuth);

  if (authData.isAuth) return <AvatarMenu avatar={authData.avatar} />;

  return (
    <>
      <Button asChild>
        <Link href={"/sign-in"}>Sign in</Link>
      </Button>
      <Button asChild variant={"secondary"}>
        <Link href={"/sign-up"}>Sign up</Link>
      </Button>
    </>
  );
}
