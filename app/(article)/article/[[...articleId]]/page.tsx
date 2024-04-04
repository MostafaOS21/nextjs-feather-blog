"use client";
import { MouseEvent, useEffect, useRef, useState } from "react";
import ArticleTitle from "../../components/ArticleTitle";
import Banner from "../../components/Banner";
import EditorContainer from "../../components/EditorContainer";
import "./index.css";
import { Logo } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import EditorJS from "@editorjs/editorjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { api } from "@/api/api";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/helpers/ApiError";
import axios from "axios";
import { refreshAuth } from "@/app/actions";

// Start Validations
const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 100;

const DESCRIPTION_MIN_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 200;

const TAGS_MIN_LENGTH = 1;
const TAGS_MAX_LENGTH = 7;
const SINGLE_TAG_MAX_LENGTH = 60;

// End Validations

export interface IBlogData {
  banner: {
    clientUrl: string;
    file: File | undefined;
    defaultBanner?: string;
  };
  blogTitle: string;
  blocks: any[];
  tags: string[];
  description: string;
}

const blogData = {
  banner: {
    clientUrl: "",
    file: undefined,
  },
  blogTitle: "",
  blocks: [],
  tags: [],
  description: "",
};

export default function ArticlePage() {
  const [articleData, setArticleData] = useState<IBlogData>(blogData);
  const editorRef = useRef<EditorJS>();
  const titleRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const router = useRouter();
  const [articleId, setArticleId] = useState<string | null>(null);
  // Button states
  const [isPublishing, setIsPublishing] = useState(false);
  // Disable buttons
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isPublishDisabled, setIsPublishDisabled] = useState(true);

  useEffect(() => {
    // Load existing article
    const loadExistingArticle = () => {
      // Load existed article
      let articleIds = params?.articleId;
      const controller = new AbortController();

      if (articleIds) {
        if (articleIds.length > 1) {
          router.push("/");
          toast("Sorry the article not found.");
        } else {
          setArticleId(articleIds[0]);

          // Get article
          api
            .get(`article/edit/${articleIds[0]}`, {
              signal: controller.signal,
            })
            .then((data) => {
              let result = data.data;

              setArticleData(() => {
                return {
                  blogTitle: result?.title || "",
                  banner: {
                    clientUrl: result?.banner || "",
                    file: undefined,
                    defaultBanner: result?.banner
                      ? `${process.env.NEXT_PUBLIC_ARTICLE_ASSETS_URL}${result?.banner}`
                      : "",
                  },
                  blocks: result?.content || [],
                  description: result?.description || "",
                  tags: result?.tags || [],
                };
              });

              editorRef.current?.render({ blocks: result?.content || [] });
            })
            .catch((err) => {
              if (!axios.isCancel(err)) {
                router.push("/article");
              }
            });
        }

        return () => controller.abort();
      }
    };

    // And check if user authorized
    const authorizationCheck = async () => {
      const res = await refreshAuth();

      if (res.isAuth) {
        loadExistingArticle();
      } else {
        window.location.href = "/sign-in";
      }
    };
    authorizationCheck();
  }, []);

  // Callback save content
  const handleSave = async () => {
    if (editorRef.current) {
      // Set the save state
      setIsSaveDisabled(true);
      setIsPublishDisabled(false);

      // Form Data
      const formData = new FormData();
      formData.append("banner", articleData?.banner?.file as Blob);
      formData.append("title", titleRef.current?.value ?? "");
      formData.append("content", JSON.stringify(articleData.blocks));

      const headers = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      try {
        if (!articleId) {
          const res = await api.post("/article/save-draft", formData, headers);

          const data = await res.data;

          if (res.status === 201) {
            setArticleId(data.articleId);
            window.history.pushState({}, "", `/article/${data.articleId}`);
          }
        } else {
          await api.put(`/article/save-draft/${articleId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      } catch (error: any) {
        return toast.error(ApiError.generate(error).message);
      }
    }
  };

  // handle prepare publishing
  const handlePreparePublish = (e: MouseEvent<HTMLButtonElement>) => {
    // Set the save click
    setIsPublishDisabled(true);
    setIsSaveDisabled(true);

    // Validate banner
    if (
      !articleData.banner.clientUrl &&
      !articleData.banner.file &&
      !articleData.banner.defaultBanner
    ) {
      toast("Please add a banner image");
      return e.preventDefault();
    }

    // Validate title
    const title = titleRef.current?.value;

    if (!titleRef.current?.value) {
      return toast("Title is required");
    }

    if (titleRef.current.value.length < TITLE_MIN_LENGTH) {
      return toast("Title must be at least 10 characters");
    }

    if (titleRef.current.value.length > TITLE_MAX_LENGTH) {
      return toast("Content is too long min 100 characters");
    }

    if (articleData.blogTitle.length > TITLE_MAX_LENGTH) {
      toast("Content is too long min 100 characters");
      return e.preventDefault();
    }

    // Validate Content
    if (articleData.blocks.length < 1) {
      toast("Please add some content to your blog");
      return e.preventDefault();
    }
  };

  // handle upload article
  const handleUploadArticle = async () => {
    setIsPublishDisabled(true);
    setIsSaveDisabled(true);

    // Validate title
    if (!titleRef.current?.value) {
      return toast("Title is required");
    }

    if (titleRef.current.value.length < TITLE_MIN_LENGTH) {
      return toast("Title must be at least 10 characters");
    }

    if (titleRef.current.value.length > TITLE_MAX_LENGTH) {
      return toast("Content is too long min 100 characters");
    }

    // Validate description
    if (
      !articleData.description ||
      articleData.description.length < DESCRIPTION_MIN_LENGTH
    ) {
      return toast("Description must be at least 100 characters");
    }

    if (articleData.description.length > DESCRIPTION_MAX_LENGTH) {
      return toast("Description is too long min 200 characters");
    }

    // Validate Content
    if (articleData.blocks.length < 1) {
      return toast("Please add some content to your blog");
    }

    // Validate tags
    if (articleData.tags.length < TAGS_MIN_LENGTH) {
      return toast("Please add some tags to your blog");
    }

    if (articleData.tags.length > TAGS_MAX_LENGTH) {
      return toast("Too many tags, max 7");
    }

    setIsPublishing(true);
    // Prepare the data
    const formData = new FormData();

    formData.set(
      "banner",
      (articleData.banner.file as Blob) ||
        articleData.banner.defaultBanner ||
        ""
    );
    formData.set("title", titleRef.current?.value || articleData.blogTitle);
    formData.set("description", articleData.description);
    formData.set("content", JSON.stringify(articleData.blocks));
    formData.set("tags", JSON.stringify(articleData.tags));

    const encodedData = new URLSearchParams(formData as any).toString();

    try {
      const res = await api.post(`/article/publish/${articleId}`, encodedData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await res.data;

      if (res.status === 200) {
        toast.success(data.message);
        router.push("/");
      }
    } catch (error) {
      return toast.error(ApiError.generate(error).message);
    }
  };

  return (
    <>
      <header>
        <div>
          <Logo />
          <p>New Blog</p>
        </div>

        <div className="gap-4">
          {/* Handle Publish */}
          <Sheet>
            <SheetTrigger
              disabled={!isSaveDisabled || isPublishDisabled}
              onClick={handlePreparePublish}
              className={`!bg-black disabled:opacity-40 disabled:cursor-default py-[8px] px-4 h-fit cursor-pointer rounded-full text-white text-sm`}
              id="publishBtn"
            >
              Publish
            </SheetTrigger>
            <SheetContent
              className="!max-w-screen h-screen overflow-y-auto px-8 md:px-44 lg:px-48 "
              side={"bottom"}
            >
              <div className="grid grid-cols-1 h-full lg:grid-cols-[1fr_5px_1fr] items-center gap-8 py-10">
                <div className="flex flex-col gap-3 h-full justify-center">
                  <p className="font-medium text-zinc-500">Preview</p>
                  <div className="w-full h-[210px] md:h-[310px]">
                    <Image
                      src={
                        articleData.banner.defaultBanner
                          ? `${articleData.banner.defaultBanner}`
                          : articleData.banner.clientUrl
                      }
                      width={350}
                      height={350}
                      alt="Banner"
                      className="w-full h-full object-fill rounded-md shadow-xl"
                    />
                  </div>
                  <h2 className="font-semibold">
                    {titleRef.current?.value || articleData.blogTitle}
                  </h2>
                </div>
                <Separator orientation="vertical" className="hidden lg:block" />
                <Separator
                  orientation="horizontal"
                  className="block lg:hidden"
                />
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="blogTitle"
                      className="text-md text-zinc-600 font-medium text-sm"
                    >
                      Blog title
                    </label>
                    <Input
                      id="blogTitle"
                      defaultValue={titleRef.current?.value}
                      maxLength={100}
                      customClass="w-full"
                      className="w-full"
                      onChange={(e) => {
                        const value = e.target.value;

                        if (titleRef.current?.value) {
                          titleRef.current.value = value;
                        }

                        setArticleData((prev) => {
                          return { ...prev, blogTitle: value };
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="description"
                      className="text-md text-zinc-600 font-medium text-sm"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      onChange={(e) => {
                        const value = e.target.value;
                        setArticleData((prev) => {
                          return { ...prev, description: value };
                        });
                      }}
                      className="h-[185px]  resize-none w-full"
                      maxLength={200}
                      defaultValue={articleData.description}
                    ></Textarea>
                    <p className="text-sm ms-auto text-md text-zinc-600 font-medium">
                      {DESCRIPTION_MAX_LENGTH - articleData.description.length}{" "}
                      characters left
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="tags"
                      className="text-md text-zinc-600 font-medium text-sm"
                    >
                      Topics - (helps readers find your blog)
                    </label>

                    <form
                      className="bg-secondary h-fit p-2 px-3"
                      onSubmit={(e) => {
                        e.preventDefault();

                        const tagsInput = document.querySelector(
                          "#tags"
                        ) as HTMLInputElement;

                        const value = tagsInput.value;

                        if (value.length < 1) return toast("Tag is required");
                        if (value.length > SINGLE_TAG_MAX_LENGTH)
                          return toast(
                            `Tag must be less than ${SINGLE_TAG_MAX_LENGTH} characters`
                          );

                        if (tagsInput.value) {
                          setArticleData((prev) => {
                            return {
                              ...prev,
                              tags: [...prev.tags, value.trim()],
                            };
                          });
                          tagsInput.value = "";
                        }
                      }}
                    >
                      <Input
                        id="tags"
                        customClass="w-full bg-white"
                        className="w-full bg-white focus-within:bg-white"
                        placeholder="Add topics"
                      />
                      <ul className="w-full h-fit mt-3 flex items-center flex-wrap gap-2">
                        {articleData.tags.map((tag, index) => (
                          <li
                            key={index}
                            className="bg-white py-1 px-3 pe-1 min-w-[60px] rounded-full flex items-center justify-between gap-2 text-sm font-medium"
                          >
                            {tag}
                            <span
                              className="p-1 rounded-full hover:bg-secondary cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                setArticleData((prev) => {
                                  return {
                                    ...prev,
                                    tags: prev.tags.filter(
                                      (_, i) => i !== index
                                    ),
                                  };
                                });
                              }}
                            >
                              <X size={14} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </form>
                    <p className="text-sm ms-auto text-md text-zinc-600 font-medium">
                      {TAGS_MAX_LENGTH - articleData.tags.length} characters
                      left
                    </p>
                  </div>
                  <div>
                    <Button
                      className="w-full bg-green-700"
                      onClick={handleUploadArticle}
                      disabled={isPublishing}
                    >
                      Publish now!
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Handle Save */}
          <Button
            variant={"secondary"}
            onClick={handleSave}
            disabled={isSaveDisabled}
            id="saveDraftBtn"
          >
            Save Draft
          </Button>
        </div>
      </header>

      <section
        className={`px-8 md:px-28 lg:px-40 xl:px-80 py-5 flex flex-col gap-10 transition-opacity`}
      >
        <Banner
          setArticleData={setArticleData}
          banner={articleData.banner}
          defaultBanner={articleData.banner.defaultBanner}
          setIsSaveDisabled={setIsSaveDisabled}
        />
        <ArticleTitle
          titleRef={titleRef}
          defaultValue={articleData.blogTitle}
          setIsSaveDisabled={setIsSaveDisabled}
          setIsPublishDisabled={setIsPublishDisabled}
        />
        <EditorContainer
          useArticleData={{ articleData, setArticleData }}
          editorRef={editorRef}
          setIsSaveDisabled={setIsSaveDisabled}
          setIsPublishDisabled={setIsPublishDisabled}
        />
      </section>
    </>
  );
}
