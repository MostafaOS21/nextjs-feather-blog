import { getAllArticles, searchUsers } from "@/app/actions";
import ArticleList from "@/components/shared/ArticleList";
import WarningText from "@/components/shared/WarningText";
import { TabList } from "@/components/ui/tabs-list";
import { Metadata } from "next";
import { User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUrl, slicingText } from "@/lib/utils";
import Link from "next/link";

type Props = {
  params: { search: string };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Search: ${params.search}`,
    description: `Search results for ${params.search}`,
  };
}

// User Item
function UserItem({ user }: { user: user }) {
  return (
    <Link
      className="flex items-center gap-3 py-1"
      href={`/user/${user.username}`}
    >
      <Avatar className="w-[35px] h-[35px]">
        <AvatarImage src={generateAvatarUrl(user.avatar)} />
      </Avatar>

      <div>
        <h6 className="font-semibold text-[16px]">
          {slicingText(user.fullName)}
        </h6>
        <p className="text-[14px] font-medium text-gray-500">
          @{slicingText(user.username)}
        </p>
      </div>
    </Link>
  );
}

// Users List
function UsersList({ users }: { users: user[] }) {
  return (
    <div className="grid gap-3">
      {users.length === 0 && <WarningText message="No users found" />}
      {users.map((user, i) => (
        <>
          <UserItem user={user} key={user._id} />

          {i !== users.length - 1 && (
            <Separator orientation="horizontal" className="h-[0.8px]" />
          )}
        </>
      ))}
    </div>
  );
}

export default async function SearchQueryArticlePage({ params }: Props) {
  const resArticles = await getAllArticles(params.search);
  const resUsers = await searchUsers(params.search);
  let articlesContent, usersContent;

  if (resArticles.articles)
    articlesContent = (
      <ArticleList
        articles={resArticles.articles}
        message={resArticles.message}
        status={resArticles.status}
        search={params.search}
      />
    );
  else articlesContent = <WarningText message="No articles found" />;

  if (resUsers.users) {
    usersContent = <UsersList users={resUsers.users} />;
  } else {
    usersContent = <WarningText message="No users found" />;
  }

  const tabs = [
    {
      route: "/search/" + params.search,
      title: `Search results from "${params.search}"`,
    },
  ];

  return (
    <section className="main-grid justify-end lg:justify-between">
      <div>
        {/* Search results from "${params.search}" */}
        <h5 className="flex items-center gap-2 font-semibold text-base mb-1">
          Search results from &quot;${slicingText(params.search, 30)}&quot;
        </h5>
        {articlesContent}
      </div>

      <div className="grid grid-cols-[1fr] lg:grid-cols-[10px_1fr] gap-3 h-fit lg:sticky lg:top-5 lg:float-right lg:w-[320px] lg:h-screen">
        <Separator orientation="vertical" className="hidden lg:block" />

        <div>
          <h5 className="flex items-center gap-2 font-semibold text-base mb-1">
            Users related to search <User size={17} />
          </h5>
          {usersContent}
        </div>
        <Separator orientation="horizontal" className="block lg:hidden" />
      </div>
    </section>
  );
}
