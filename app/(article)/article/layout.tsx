import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article",
  description: "Article",
};

export default async function ArticlePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
