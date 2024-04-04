import { Banner } from "../components/ArticleComponents";
import { getArticle } from "@/app/actions";
import WarningText from "@/components/shared/WarningText";
import Author from "../components/Author";
import { format } from "date-fns";
import Interactions from "../components/Interactions";
import EditorContentParser from "../components/EditorContentParser";

export default async function ReadingArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  let content;

  if (slug) {
    const data = await getArticle(slug);

    if (data.status !== 200) {
      content = <WarningText message={data.message} />;
    } else if (data.article) {
      const { article } = data;
      const { author } = article;
      content = (
        <>
          <div className="flex flex-col gap-5">
            <Banner
              banner={`${process.env.NEXT_PUBLIC_ARTICLE_ASSETS_URL}/${article.banner}`}
            />
            <h1 className="text-xl lg:text-4xl">{article.title}</h1>
            <div className="flex flex-col-reverse items-start lg:flex-row lg:justify-between lg:items-center">
              <Author
                avatar={author.avatar}
                fullName={author.fullName}
                username={author.username}
              />
              <div className="text-sm text-gray-500 font-medium py-3 mx-auto lg:mx-0 lg:py-0">
                Published on {format(article.createdAt, "dd MMM, yy")}
              </div>
            </div>
            <Interactions slug={slug} />
            <EditorContentParser content={article.content} />
          </div>
        </>
      );
    }
  } else {
    content = <WarningText message="Not found article" />;
  }

  return (
    <section className="py-6 px-6 md:px-40 lg:px-80 overflow-x-hidden">
      {content}
    </section>
  );
}
