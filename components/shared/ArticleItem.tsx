import { IArticle } from "@/interfaces/IArticle";
import { format } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { generateAvatarUrl } from "@/lib/utils";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Noto_Serif_Georgian } from "next/font/google";
import { Separator } from "@radix-ui/react-separator";

// Serif font
const serif_font = Noto_Serif_Georgian({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const ArticleItem = ({
  article,
  index,
}: {
  article: IArticle;
  index: number;
}) => {
  const { author } = article;
  const username =
    author.username.length > 20
      ? author.username.slice(0, 18) + "..."
      : author.username;

  const title =
    article.title.length > 45
      ? article.title.slice(0, 42) + "..."
      : article.title;

  const description =
    article.description.length > 45
      ? article.description.slice(0, 42) + "..."
      : article.description;
  const formattedPublishDate = format(article.createdAt, "dd MMM, yy");

  return (
    <>
      <Link
        href={`/read/${article.slug}`}
        className={`transition-colors hover:bg-secondary/30 p-3 animate-in`}
      >
        <div className="flex items-center text-sm text-zinc-600 font-medium gap-2">
          <Avatar className="bg-slate-20 w-[24px] h-[24px]">
            <AvatarImage
              src={generateAvatarUrl(author.avatar)}
              alt={author.fullName}
            />
          </Avatar>
          <p>{username}@</p>
          <p>{formattedPublishDate}</p>
        </div>
        <div className="flex items-center justify-between flex-col-reverse lg:flex-row">
          <div>
            <h4>{title}</h4>
            <p className={serif_font.className}>{description}</p>
          </div>
          <div className="w-full h-[170px] py-2 lg:py-0 lg:w-[120px] lg:h-[80px]">
            <Image
              src={`${
                process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
              }/article-images/${article.banner}`}
              width={200}
              height={200}
              alt={`article banner about: ${article.title}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="tag">{article.tags[0]}</span>
          <span className="flex items-center gap-2 font-medium text-zinc-600">
            <Heart size={18} />{" "}
            <span className="text-xs">{Object.keys(article.likes).length}</span>
          </span>
        </div>
      </Link>

      <Separator
        orientation="horizontal"
        className="bg-secondary h-[0.7px] w-full"
      />
    </>
  );
};

export default ArticleItem;
