"use client";
import { IArticle } from "@/interfaces/IArticle";
import ArticleItem from "./ArticleItem";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const ArticleList = ({
  articles,
  interactions,
}: {
  articles: IArticle[];
  interactions: { likes: number; commentsCount: number }[];
}) => {
  const [search, setSearch] = useState("");

  return (
    <div>
      <Input
        placeholder="Search article..."
        className="w-full rounded-full px-3 py- mb-5 lg:mb-0"
        onChange={(e) => setSearch(e.target.value)}
      >
        <Search className="opacity-25" />
      </Input>

      {articles.map((article, i) =>
        article.title.toLowerCase().includes(search.toLowerCase()) ? (
          <ArticleItem
            key={i}
            article={article}
            i={i}
            interactions={interactions}
          />
        ) : null
      )}
    </div>
  );
};

export default ArticleList;
