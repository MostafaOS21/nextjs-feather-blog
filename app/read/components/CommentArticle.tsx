"use client";
import { addComment, getAllComments, getReplies } from "@/app/actions";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/helpers/ApiError";
import { MessageCircleMore } from "lucide-react";
import {
  useState,
  useOptimistic,
  useEffect,
  useRef,
  startTransition,
  FormEvent,
} from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Trash, MessageCircleReply } from "lucide-react";
import { Noto_Serif_Georgian } from "next/font/google";
import styles from "../styles.module.css";
import { generateAvatarUrl } from "@/lib/utils";

// Serif font
const serif_font = Noto_Serif_Georgian({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const slicingText = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

interface IComment {
  _id: string;
  body: string;
  author: {
    avatar: string;
    username: string;
    fullName: string;
  };
  createdAt: Date;
  level: number;
  parent: string | null;
  children: IComment[];
  childrenCount: number;
  article: string;
}

const Comment = ({
  comment,
  userId,
  replyTo,
}: {
  comment: IComment;
  userId: string | null;
  replyTo: string;
}) => {
  const customAvatar = `${process.env.NEXT_PUBLIC_API_URL}/custom_user.png`;
  const [showChildren, setShowChildren] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [repliesCount, setRepliesCount] = useState<number>(
    comment.children.length
  );
  const [replies, setReplies] = useState<IComment[]>([]);
  const [optimisticReplies, setOptimisticReplies] =
    useOptimistic<IComment[]>(replies);
  const [isPending, setIsPending] = useState(false);
  const [authorRepliedTo, setAuthorRepliedTo] = useState<string>("");

  const handleReply = async (e: FormEvent, comment: IComment) => {
    // Add new comment
    e.preventDefault();

    setIsPending(true);

    const reply = new FormData(e.target as HTMLFormElement)?.get("reply");

    if (!reply) return toast.error("Reply can't be empty");

    // Optimistic UI
    const optimisticReply: IComment = {
      _id: `optimistic-${Date.now()}`,
      body: reply as string,
      level: comment.level + 1,
      createdAt: new Date(),
      parent: comment._id,
      author: {
        avatar: comment.author.avatar || customAvatar,
        username: "You",
        fullName: "You",
      },
      children: [],
      childrenCount: 0,
      article: comment.article,
    };

    startTransition(() => {
      setOptimisticReplies((prev) => [...prev, optimisticReply]);
    });

    const res = await addComment(comment.article, reply as string, comment._id);

    setReplies((prev) => [...prev, res.comment]);

    if (res.status === 201) {
      toast.success("Reply added successfully");
      setShowChildren(true);
      setShowReply(false);
      // Empty the textarea
      (e.target as HTMLFormElement).reset();

      setRepliesCount((v) => v + 1);
    } else {
      toast.error(res.message);
    }

    setIsPending(false);
  };

  const handleShowHideReplies = async (comment: IComment) => {
    setShowChildren(true);

    const res = await getReplies(comment._id);
    if (res.status === 200) {
      setAuthorRepliedTo(res.replyTo);
      setReplies(res.comments);
    }
  };

  // width based on level: min => 1, max => 4
  const levelStyles =
    comment.level === 1
      ? "w-full"
      : comment.level === 2
      ? "w-[90%]"
      : comment.level === 3
      ? "w-[80%]"
      : "w-[70%]";
  const leftLevel =
    comment.level === 1
      ? "left-0 bg-slate-200"
      : comment.level === 2
      ? "left-[10%] bg-slate-300"
      : comment.level === 3
      ? "left-[20%] bg-slate-400"
      : "hidden";

  const commentBeforeLineClasses = `absolute ${leftLevel} bottom-0 w-[0.5px] h-full`;

  const avatarUrl = generateAvatarUrl(comment.author.avatar);

  return (
    <div className={"relative"}>
      <span className={commentBeforeLineClasses}></span>
      <div
        key={comment._id}
        className={
          "flex flex-col gap-2 p-3 border-[1px] border-secondary " +
          levelStyles +
          " ms-auto"
        }
      >
        <p className="text-xs font-medium text-gray-600">
          {replyTo && `Replying to ${replyTo}`}
        </p>
        <div className="flex items-center gap-2 font-medium text-sm">
          <Avatar className="w-[25px] h-[25px]">
            <AvatarImage src={avatarUrl} />
          </Avatar>
          <div>
            <p>{slicingText(comment.author?.fullName || "", 17)}</p>
          </div>
          <p className="text-gray-500 ps-2 flex items-center gap-2">
            <span className="bg-gray-400 w-[4px] h-[4px] rounded-full"></span>
            {format(comment.createdAt, "dd MMM")}
          </p>
        </div>
        <p className={"p-2 " + serif_font.className}>{comment.body}</p>

        <div>
          <div className="flex items-center">
            <Button
              variant={"link"}
              disabled={comment.children.length === 0}
              onClick={() => handleShowHideReplies(comment)}
            >
              <MessageCircleReply size={16} className="me-2" />
              {!showReply
                ? `${repliesCount} ${repliesCount > 1 ? "replies" : "reply"}`
                : "Hide replies"}
            </Button>

            <Button
              disabled={!userId}
              variant={"ghost"}
              onClick={() => setShowReply(true)}
            >
              Reply
            </Button>
          </div>
          {showReply && (
            <form className="mt-2" onSubmit={(e) => handleReply(e, comment)}>
              <Textarea
                className="resize-none h-[100px] text-[17px] w-full mb-2"
                placeholder="Leave a reply..."
                required
                name="reply"
                disabled={!userId || isPending}
              ></Textarea>
              <div className="flex items-center gap-2">
                <Button type="submit">Reply</Button>
                <Button
                  variant={"secondary"}
                  type="reset"
                  onClick={() => setShowReply(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      {showChildren && (
        <div className="mt-2 flex flex-col gap-2 ">
          {optimisticReplies.map((r) => (
            <Comment
              comment={r}
              key={r._id}
              userId={userId}
              replyTo={authorRepliedTo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Comments
const CommentsArticle = ({
  count,
  isAuthed,
  slug,
}: {
  count: number;
  isAuthed: boolean;
  slug: string;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [optimisticComments, setOptimisticComments] =
    useOptimistic<IComment[]>(comments);
  const [page, setPage] = useState(1);
  const newCommentRef = useRef<HTMLTextAreaElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get all comments
  useEffect(() => {
    const getComments = async () => {
      const data = await getAllComments(slug, page);
      setUserId(data.user_id);

      if (data.status === 200) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    };

    getComments();
  }, []);

  // Add new comment
  const addNewComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newComment = newCommentRef.current?.value;

    if (!newComment) return toast.error("Comment can't be empty");

    // Optimistic UI
    const optimisticComment = {
      _id: `optimistic-${Date.now()}`,
      body: newComment,
      level: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      parent: null,
      author: {
        avatar: "",
        username: "You",
        fullName: "You",
      },
      children: [],
      childrenCount: 0,
      article: slug,
    };

    startTransition(() => {
      setOptimisticComments((prev) => [...prev, optimisticComment]);
    });

    try {
      setIsPending(true);

      const res = await addComment(slug, newComment as string);

      if (res.status === 201) {
        toast.success("Comment added successfully");
        newCommentRef.current!.value = "";

        setComments((prev) => [...prev, res.comment]);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error(ApiError.generate(error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center gap-1">
          <Button
            variant={"secondary"}
            className="!p-[10px] hover:bg-secondary/70"
          >
            <MessageCircleMore size={18} />
          </Button>
          {count}
        </div>
      </SheetTrigger>
      <SheetContent
        className={
          "w-[450px] p-3 overflow-y-auto scroll-smooth " +
          styles.styledScrollbar
        }
      >
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>Give your ideas about the article</SheetDescription>
        </SheetHeader>

        <form className="py-4 flex flex-col gap-4" onSubmit={addNewComment}>
          <Textarea
            className="resize-none h-[162px] text-[17px] w-full"
            placeholder={isAuthed ? "Leave a comment..." : "Sign in first"}
            disabled={!isAuthed || isPending}
            name="comment"
            ref={newCommentRef}
            required
          ></Textarea>
          <Button className="w-fit" disabled={!isAuthed || isPending}>
            Comment
          </Button>
        </form>

        <div className="flex flex-col gap-2">
          {optimisticComments.map((c) => (
            <Comment comment={c} key={c._id} userId={userId} replyTo="" />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentsArticle;
