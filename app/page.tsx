import ArticleList from "@/components/shared/ArticleList";
import { Separator } from "@/components/ui/separator";
import { getAllArticles, getTrending } from "./actions";
import WarningText from "@/components/shared/WarningText";
import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateAvatarUrl } from "@/lib/utils";
import { TabList } from "@/components/ui/tabs-list";
import { tabs } from "@/helpers/constants";

export const TrendingContainer = async ({
  currentTag,
  sliceTags,
  sliceArticles,
}: {
  currentTag: string;
  sliceTags?: number;
  sliceArticles?: number;
}) => {
  const res = await getTrending();

  if (res.status !== 200) {
    return <WarningText message={res.message} />;
  }

  const tags = res.tags as string[];
  const topArticles: {
    _id: string;
    title: string;
    createdAt: string;
    slug: string;
    author: {
      username: string;
      fullName: string;
      avatar: string;
    };
  }[] = res.topArticles;

  return (
    <div>
      <h5 className="mb-3">Stories from all interests</h5>
      <div className="flex gap-2 flex-wrap text-sm capitalize font-medium mb-8">
        {tags.length === 0 && <WarningText message="No tags found" />}
        {tags?.slice(0, sliceTags || tags?.length)?.map((tag, index) => (
          <Button
            variant={
              currentTag.toLocaleLowerCase() === tag.toLowerCase()
                ? "default"
                : "secondary"
            }
            key={index + "btn"}
            asChild
          >
            <Link href={`/tag/${tag}`} key={index}>
              {tag}
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h5>Top reads</h5>
        {topArticles.length === 0 && (
          <WarningText message="No top articles found" />
        )}
        {topArticles
          .slice(0, sliceArticles || topArticles.length)
          .map((article, index, arr) => {
            const avatar = article.author.avatar;

            const avatarContent = (
              <Avatar className="w-[19px] h-[19px]">
                <AvatarImage src={generateAvatarUrl(avatar)} />
              </Avatar>
            );

            return (
              <>
                <Link
                  href={`/read/${article.slug}`}
                  key={article._id}
                  className="flex items-center gap-2"
                >
                  <div className="h-full self-start text-5xl font-semibold text-slate-200">
                    {`${index + 1}`.padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium flex items-center gap-1">
                      {avatarContent}
                      <p>{article.author?.fullName}</p>
                      <p>{format(article.createdAt, "dd MMM")}</p>
                    </div>
                    <h5 className="text-[17px] mt-1">
                      {article.title.length > 41
                        ? article.title.slice(0, 41) + "..."
                        : article.title}
                    </h5>
                  </div>
                </Link>

                {index !== arr.length - 1 && (
                  <Separator className="h-[0.7px] bg-secondary" key={index} />
                )}
              </>
            );
          })}
      </div>
    </div>
  );
};

export default async function Home() {
  const res = await getAllArticles();

  return (
    <section className="main-grid">
      <div className="flex flex-col gap-4">
        <TabList tabs={tabs} />
        <ArticleList
          status={res.status}
          message={res.message}
          articles={res.articles}
        />
      </div>
      <div className="main-grid lg:sticky lg:top-5 lg:float-right lg:w-[320px] lg:h-screen">
        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator orientation="horizontal" className="lg:hidden" />
        <aside>
          <TrendingContainer currentTag="" sliceTags={7} sliceArticles={4} />
        </aside>
      </div>
    </section>
  );
}
