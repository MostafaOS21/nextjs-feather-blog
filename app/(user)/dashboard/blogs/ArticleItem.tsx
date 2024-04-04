import { IArticle } from "@/interfaces/IArticle";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

import { slicingText } from "@/lib/utils";
import { Lock } from "lucide-react";
import DeleteArticle from "./DeleteArticle";

export default function ArticleItem({
  article,
  i,
  interactions,
}: {
  article: IArticle;
  i: number;
  interactions: { likes: number; commentsCount: number }[];
}) {
  return (
    <div
      key={article.slug}
      className="flex flex-col lg:flex-row items-center gap-4"
    >
      <div className="w-full h-[250px] lg:w-[130px] lg:h-[130px] overflow-hidden ">
        <Image
          src={`${process.env.NEXT_PUBLIC_ARTICLE_ASSETS_URL}/${article.banner}`}
          width={130}
          height={130}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex flex-col justify-between h-full gap-1">
        <p className="text-xl font-semibold flex items-center gap-2">
          {slicingText(article.title, 45)}{" "}
          {!article.isPublished && (
            <span className="text-gray-600">{<Lock size={17} />}</span>
          )}
        </p>
        <p className="font-medium text-gray-600 text-sm">
          Created At {format(article.createdAt, "dd MMM yyyy")}
        </p>

        <div className="flex items-start lg:items-center gap-2">
          {/* Edit Article */}
          <Button variant={"link"} asChild className="!p-0">
            <Link href={`/article/${article._id}`}>Edit</Link>
          </Button>
          {/* Delete Article */}
          <DeleteArticle id={article._id} />
        </div>
      </div>

      <div className="flex items-center mx-auto lg:ms-auto lg:me-0 gap-5 h-full font-medium text-gray-700">
        <p className="flex flex-col items-center gap-2">
          <span>{interactions?.[i]?.likes || 0}</span>
          <span>Likes</span>
        </p>
        <Separator orientation="vertical" className="h-[70px]" />
        <p className="flex flex-col items-center gap-2">
          <span>{interactions?.[i]?.commentsCount || 0}</span>
          <span>Comments</span>
        </p>
      </div>
    </div>
  );
}
