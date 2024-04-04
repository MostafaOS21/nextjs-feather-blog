import { getUserPersonalArticles, refreshAuth } from "@/app/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import jwt from "jsonwebtoken";
import ArticleList from "./ArticleList";
import { Metadata } from "next";

export const metadata = (): Metadata => {
  return {
    title: "Dashboard | Blogs",
    description: "Check all your blogs",
  };
};

export default async function page() {
  let accessToken = cookies().get("access-token")?.value;

  if (!accessToken) redirect("/sign-in");

  accessToken = accessToken.replace("Bearer ", "");

  const user = jwt.decode(accessToken);

  // @ts-ignore
  if (!user?.username) {
    redirect("/sign-in");
  }

  //@ts-ignore
  const res = await getUserPersonalArticles(user?.username);

  return (
    <div>
      <ArticleList articles={res.articles} interactions={res.interactions} />
    </div>
  );
}
