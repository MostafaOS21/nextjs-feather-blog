import { Metadata } from "next";
import React from "react";

type Props = {
  params: { slug: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = params.slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .slice(0, -1)
    .join(" ");

  return {
    title: decodeURIComponent(title),
    description: `Read: ${decodeURIComponent(title)}`,
  };
}

export default function ReadArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
