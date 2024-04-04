import { getUserArticles, getUserProfile } from "@/app/actions";
import WarningText from "@/components/shared/WarningText";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabList } from "@/components/ui/tabs-list";
import { IUser } from "@/interfaces/IUser";
import { generateAvatarUrl, slicingText } from "@/lib/utils";
import { format } from "date-fns";
import {
  Dot,
  Facebook,
  Github,
  Globe,
  Heart,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const username = params.username;

  // Get current page
  let page = searchParams?.["page"];
  if (!page) {
    page = "1";
  }
  if (Array.isArray(page)) {
    page = page[0];
  }
  const currentPage = isNaN(parseInt(page)) ? 1 : parseInt(page);

  // Fetch articles and user
  const userProfileResponse = await getUserProfile(username);
  const articlesResponse = await getUserArticles(params.username, currentPage);
  let articlesContent, userContent;

  const tabs = [
    {
      route: "/user/" + params.username,
      title: "Blogs Published",
    },
  ];

  if (userProfileResponse.status !== 200) {
    redirect("/");
  } else {
    const user = userProfileResponse.user as IUser;

    const socialMediaAccounts = user.socialMediaAccounts
      .filter((a) => a.account.length > 0)
      .map((a, i) => (
        <a
          key={a._id}
          href={a.account}
          target="_blank"
          className="transition-transform hover:scale-105 text-gray-600"
        >
          {a.socialMediaName === "youtube" && <Youtube />}
          {a.socialMediaName === "website" && <Globe />}
          {a.socialMediaName === "facebook" && <Facebook />}
          {a.socialMediaName === "twitter" && <Twitter />}
          {a.socialMediaName === "github" && <Github />}
          {a.socialMediaName === "linkedin" && <Linkedin />}
        </a>
      ));

    userContent = (
      <div className="flex flex-col items-center lg:items-start gap-3 font-medium">
        <Avatar className="w-[120px] h-[120px]">
          <AvatarImage src={generateAvatarUrl(user.avatar)} />
        </Avatar>

        <h5 className="font-semibold">@{slicingText(user.username, 50)}</h5>
        <p className="text-gray-500">{slicingText(user.fullName, 50)}</p>

        <p className="text-sm">
          {userProfileResponse.publishedArticles} Published - {user.reads} Reads
        </p>

        {userProfileResponse.isProfileOwner && (
          <Button
            variant={"secondary"}
            asChild
            className="!rounded-sm my-2 mb-5"
          >
            <Link href={"/settings/edit-profile"}>Edit Profile</Link>
          </Button>
        )}

        <p className="mb-8">{user.bio ? user.bio : "No bio."}</p>

        <div className="flex items-center gap-4 py-3">
          {socialMediaAccounts}
        </div>

        <p className="text-sm text-gray-600">
          Joined on {format(user.joinDate, "dd MMM yyyy")}
        </p>
      </div>
    );
  }

  if (articlesResponse?.articles?.length > 0) {
    articlesContent = articlesResponse.articles.map((article, index, arr) => (
      <>
        <Link
          key={article._id}
          href={`/read/${article.slug}`}
          className="flex flex-col-reverse lg:flex-row items-center justify-between"
        >
          <div className="w-full lg:w-fit">
            <h5>{slicingText(article.title, 30)}</h5>
            <p>{slicingText(article.description, 40)}</p>

            <div className="text-zinc-700 text-sm py-1 flex items-center gap-1 font-medium">
              <span>{format(article.createdAt, "dd MMM")}</span>
              <Dot />
              <span className="flex items-center gap-1">
                <Heart size={15} />{" "}
                {Object.keys(articlesResponse.articles[0]?.likes)?.length || 0}
              </span>
            </div>
          </div>

          <div className="w-full h-[220px] py-2 lg:py-0 lg:w-[90px] lg:h-[60px] object-fill">
            <Image
              src={`${process.env.NEXT_PUBLIC_ARTICLE_ASSETS_URL}/${article.banner}`}
              width={350}
              height={350}
              alt="Banner"
              className="w-full h-full"
            />
          </div>
        </Link>

        {index !== arr.length - 1 && <Separator orientation="horizontal" />}
      </>
    ));
  } else {
    articlesContent = <WarningText message="No articles found." />;
  }

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = !articlesResponse.hasNext;
  const disabledAnchorClasses = "cursor-default opacity-50";

  return (
    <section className="main-grid">
      <div className="flex flex-col justify-between">
        <div className="grid gap-2">
          <TabList tabs={tabs} />
          {articlesContent}
        </div>

        <div className="w-full flex items-center justify-center gap-3 py-5">
          <Button asChild disabled={isPrevDisabled} variant={"secondary"}>
            <Link
              href={isPrevDisabled ? "#" : `/user/${username}`}
              className={isPrevDisabled ? disabledAnchorClasses : ""}
            >
              Previous
            </Link>
          </Button>
          <Button asChild disabled={isNextDisabled} variant={"secondary"}>
            <Link
              href={
                isNextDisabled
                  ? "#"
                  : `/user/${username}?page=${currentPage + 1}`
              }
              className={isNextDisabled ? disabledAnchorClasses : ""}
            >
              Next
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 mx-auto lg:mx-0">
        <Separator orientation="vertical" className="hidden lg:block" />
        {userContent}
        <Separator orientation="horizontal" className="lg:hidden" />
      </div>
    </section>
  );
}
