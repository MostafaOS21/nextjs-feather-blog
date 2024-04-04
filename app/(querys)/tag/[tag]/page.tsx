import { getAllArticles } from "@/app/actions";
import { TrendingContainer } from "@/app/page";
import ArticleList from "@/components/shared/ArticleList";
import { Separator } from "@/components/ui/separator";
import React from "react";

type Props = {
  params: { tag: string };
};

export default async function ArticleTagPage({ params: { tag } }: Props) {
  const res = await getAllArticles("", tag);

  console.log(res.articles);

  return (
    <section className="main-grid">
      <ArticleList
        status={res.status}
        message={res.message}
        articles={res.articles}
      />
      <div className="main-grid lg:sticky lg:top-5 lg:float-right lg:w-[320px] lg:h-screen">
        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator orientation="horizontal" className="lg:hidden" />
        <aside>
          <TrendingContainer currentTag={tag} />
        </aside>
      </div>
    </section>
  );
}
