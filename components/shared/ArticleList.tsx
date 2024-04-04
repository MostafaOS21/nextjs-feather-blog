"use client";
import { IArticle } from "@/interfaces/IArticle";
import React, { useEffect } from "react";
import WarningText from "./WarningText";
import ArticleItem from "./ArticleItem";
import { Button } from "../ui/button";
import { Plus, Loader } from "lucide-react";
import { getAllArticles } from "@/app/actions";

export default function ArticleList({
  articles,
  status,
  message,
  search,
  tag,
}: {
  articles: IArticle[] | null;
  status: number;
  message: string;
  search?: string;
  tag?: string;
}) {
  const [articlesList, setArticlesList] = React.useState<IArticle[] | null>(
    articles
  );
  const [page, setPage] = React.useState(1);
  const [isPending, setIsPending] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(false);
  let content;

  const loadMoreArticles = async () => {
    setIsPending(true);

    const res = await getAllArticles(search, tag, page + 1);

    if (res.status === 200) {
      setPage(page + 1);

      if (articlesList && res.articles) {
        if (res.articles.length === 0) return setIsEmpty(true);
        setArticlesList([...articlesList, ...res.articles]);
      }
    }

    setIsPending(false);
  };

  if (status !== 200) {
    content = <WarningText message={message} />;
  } else {
    content = articlesList?.map((article: IArticle, i) => (
      <ArticleItem key={article._id} article={article} index={i} />
    ));
  }

  if (articlesList?.length === 0 || !articles) {
    return (
      <div className="flex flex-col gap-4">
        <WarningText message="No articles found" />
      </div>
    );
  }

  return (
    <>
      <div>
        {content}{" "}
        {articlesList &&
          (!isEmpty ? (
            <Button
              className="flex items-center w-full gap-2 mt-4"
              variant={"secondary"}
              onClick={loadMoreArticles}
              disabled={isPending}
            >
              {isPending ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Plus size={20} />
              )}
              {isPending ? "Loading..." : "Load More"}
            </Button>
          ) : (
            <Button disabled={isEmpty} variant={"secondary"}>
              No more articles
            </Button>
          ))}
      </div>
    </>
  );
}
