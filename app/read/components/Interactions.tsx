import { likeArticle } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Twitter from "@/icons/Twitter";
import { Heart } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import CommentsArticle from "./CommentArticle";

// Like article
const LikeArticle = ({
  slug,
  count,
  isLiked,
  isAuthed,
}: {
  slug: string;
  count: number;
  isLiked: boolean;
  isAuthed: boolean;
}) => {
  return (
    <form className="flex items-center gap-1" action={likeArticle}>
      <input type="hidden" name="slug" value={slug} />
      <Button
        variant={"secondary"}
        className={`!p-[10px] hover:bg-secondary/70 ${isLiked && "bg-red-50"}`}
        disabled={!isAuthed}
      >
        <Heart
          size={18}
          className={`${isLiked && "fill-red-400 stroke-red-400"}`}
        />
      </Button>{" "}
      {count}
    </form>
  );
};

const READ_ARTICLE_URL = `${process.env.API_URL}/api/article/read`;

// Interaction Part
export default async function Interactions({ slug }: { slug: string }) {
  let content;

  const tag = `/interactions/${slug}`;

  try {
    const user_id = cookies()?.get("user_id")?.value;
    const isAuthed = Boolean(user_id);
    let headers;

    if (user_id)
      headers = {
        Cookie: `user_id=${user_id}`,
      };

    const res = await fetch(`${READ_ARTICLE_URL}/interactions/${slug}`, {
      method: "GET",
      next: { revalidate: 0, tags: [tag] },
      headers,
    });
    const data: {
      likes: number;
      comments: number;
      isLiked: boolean;
      commentsCount: number;
    } = await res.json();

    content = (
      <>
        <div className="flex items-center gap-5 font-medium text-sm text-gray-600">
          {/* Like article */}
          <LikeArticle
            count={data.likes}
            isLiked={data.isLiked}
            slug={slug}
            isAuthed={isAuthed}
          />
          {/* Comment article */}
          <CommentsArticle
            slug={slug}
            count={data.commentsCount}
            isAuthed={isAuthed}
          />
        </div>
        <Button variant={"ghost"} className="!p-2">
          <Link
            className="w-[28px] h-[28px]"
            href={`https://twitter.com/intent/tweet?text=I found this useful article on Feather blog:\n ${process.env.FRONT_END_URL}/read/${slug}`}
            target="_blank"
          >
            <Twitter />
          </Link>
        </Button>
      </>
    );
  } catch (error) {
    content = <div>Sorry an error ocurred!</div>;
  }

  return (
    <div className="flex items-center justify-between border-y py-5">
      {content}
    </div>
  );
}
