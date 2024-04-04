"use server";

import { api } from "@/api/api";
import { ApiError } from "@/helpers/ApiError";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { IArticle } from "@/interfaces/IArticle";
import { revalidatePath, revalidateTag } from "next/cache";
import { IUser } from "@/interfaces/IUser";

const API_URL = `${process.env.API_URL}/api`;

// Auth
export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/sign-in", {
      email,
      password,
    });

    const data = res.data;

    if (!data["access-token"] || !data["user_id"]) {
      throw new Error("Unauthorized");
    }

    cookies().set("access-token", data["access-token"], {
      maxAge: +(process.env.COOKIE_EXPIRE || 7200),
    });
    cookies().set("user_id", data["user_id"], {
      maxAge: +(process.env.COOKIE_EXPIRE || 7200),
    });

    revalidatePath("/read/[slug]", "page");

    return {
      ...data.data,
      status: res.status,
      message: data.message,
    };
  } catch (error) {
    return ApiError.generate(error);
  }
};

export const signUp = async ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/sign-up", {
      fullName,
      email,
      password,
    });

    const data = res.data;

    if (res.status === 201) {
      return { ...data, status: res.status };
    }
  } catch (error: any) {
    return ApiError.generate(error);
  }
};

export const signOut = async () => {
  try {
    cookies().set("access-token", "", { maxAge: -1 });
    cookies().set("user_id", "", { maxAge: -1 });
    cookies().set("connect.sid", "", { maxAge: -1 });

    redirect("/sign-in");
  } catch (error: any) {
    return ApiError.generate(error);
  }
};

export const refreshAuth = async () => {
  const accessToken = cookies().get("access-token");
  let isAuth = false;
  let user;

  if (accessToken?.value) {
    const token = accessToken.value.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
      if (err) {
        isAuth = false;
      } else {
        isAuth = true;

        user = data;
        // @ts-ignore
        cookies().set("user_id", data?.id, {
          maxAge: +(process.env.COOKIE_EXPIRE || 7200),
        });
      }
    });
  } else isAuth = false;

  return {
    isAuth,
    user,
  };
};

export const protectedRoute = async () => {
  const { isAuth } = await refreshAuth();

  if (!isAuth) {
    redirect("/sign-in");
  }
};

// Articles
export const getAllArticles = async (
  search?: string,
  tag?: string,
  page?: number,
  per_page?: number
): Promise<{
  articles: IArticle[] | null;
  status: number;
  message: string;
}> => {
  try {
    const url = new URL(`${API_URL}/article/read`);

    const params: { [key: string]: string | number | undefined } = {
      search,
      tag,
      page,
      per_page,
    };

    Object.keys(params).forEach(
      (key) => params[key] && url.searchParams.append(key, `${params[key]}`)
    );

    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 0 },
    });

    const data = await res.json();

    if (res.status !== 200) {
      // @ts-ignore
      throw new Error(data.message);
    }

    return { articles: data, status: 200, message: "articles exists" };
  } catch (error) {
    return {
      articles: null,
      ...ApiError.generate(error),
    };
  }
};

export const getTrending = async () => {
  try {
    const res = await fetch(`${API_URL}/article/read/trending`, {
      next: { tags: ["/get-trending"], revalidate: 0 },
    });

    const data = await res.json();

    return {
      topArticles: data.topArticles,
      tags: data.tags,
      status: res.status,
      message: "Data fetched successfully",
    };
  } catch (error) {
    return {
      ...ApiError.generate(error),
      topArticles: null,
      tags: null,
    };
  }
};

export const getArticle = async (
  slug: string
): Promise<{
  article?: IArticle;
  status: number;
  message: string;
}> => {
  try {
    const accessToken = cookies()?.get("access-token")?.value;
    let headers;

    if (accessToken) {
      headers = {
        Cookie: `access-token=${accessToken}`,
      };
    }

    const res = await api.get(`/article/read/${slug}`, {
      headers,
    });

    const data = res.data;
    const likesCount = data?.article?.likes
      ? Object.keys(data?.article?.likes).length
      : 0;

    return {
      article: {
        ...data.article,
        likesCount,
        commentsCount: data.commentsCount,
      },
      status: res.status,
      message: "Data fetched successfully",
    };
  } catch (error) {
    return ApiError.generate(error);
  }
};

// Read article
const READ_ARTICLE_URL = `${API_URL}/article/read`;

export const likeArticle = async (formData: FormData) => {
  try {
    const slug = formData.get("slug") || undefined;

    if (!slug) throw new Error("Slug is not valid");

    const user_id = cookies()?.get("user_id")?.value;
    const accessToken = cookies()?.get("access-token")?.value;
    let headers;

    if (user_id) {
      headers = {
        Cookie: `user_id=${user_id}; access-token=${accessToken}`,
      };
    } else {
      throw new Error("Unauthorized");
    }

    const tag = `/like/${slug}`;

    await fetch(`${READ_ARTICLE_URL}/like/${slug}`, {
      next: { revalidate: 6000, tags: [tag, `/interactions/${slug}`] },
      method: "PATCH",
      headers,
    });

    revalidateTag(tag);
  } catch (error) {
    return ApiError.generate(error);
  }
};

// Comments
export const getAllComments = async (slug: string, page: number = 1) => {
  const user_id = cookies()?.get("user_id")?.value || null;
  try {
    const res = await fetch(`${API_URL}/article/comment/${slug}?page=${page}`, {
      method: "GET",
      next: { tags: ["/get-all-comments"], revalidate: 0 },
    });

    const data = await res.json();

    return {
      comments: data?.comments,
      status: res.status,
      message: data?.message,
      user_id,
    };
  } catch (error) {
    return {
      ...ApiError.generate(error),
      user_id,
      comments: null,
    };
  }
};

export const addComment = async (
  slug: string,
  body: string,
  replyTo?: string
) => {
  const user_id = cookies()?.get("user_id")?.value;
  const accessToken = cookies()?.get("access-token")?.value;

  try {
    if (!user_id || !accessToken) throw new Error("Unauthorized");

    const res = await api.post(
      `/article/comment/${slug}`,
      {
        body,
        replyTo,
      },
      {
        headers: {
          Cookie: `user_id=${user_id}; access-token=${accessToken}`,
        },
      }
    );

    revalidateTag(`/get-all-comments`);

    return {
      status: res.status,
      message: "Comment added successfully",
      comment: res.data.comment,
    };
  } catch (error) {
    return {
      ...ApiError.generate(error),
      comment: null,
    };
  }
};

export const getReplies = async (commentId: string) => {
  try {
    const res = await api.get(`/article/comment/reply/${commentId}`);
    const data = res.data;

    return {
      comments: data.comments,
      status: res.status,
      message: data.message,
      replyTo: data.replyTo,
    };
  } catch (error) {
    return {
      ...ApiError.generate(error),
      comments: null,
      replyTo: "",
    };
  }
};

// User
export const getUserArticles = async (username: string, page: number = 1) => {
  try {
    const res = await api.get(`/user/published/${username}?page=${page}`);
    const data: { articles: IArticle[]; hasNext: boolean } = await res.data;

    return {
      articles: data.articles,
      hasNext: data.hasNext,
      status: 200,
    };
  } catch (error) {
    return {
      ...ApiError.generate(error),
      articles: [],
      hasNext: false,
    };
  }
};

export const searchUsers = async (search: string, page: number = 1) => {
  try {
    const url = new URL(`${API_URL}/user`);

    const params: { [key: string]: string | number | undefined } = {
      search,
    };

    Object.keys(params).forEach(
      (key) => params[key] && url.searchParams.append(key, `${params[key]}`)
    );

    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 0 },
    });

    const data: { users: user[]; message: string } = await res.json();

    return {
      users: data.users || [],
      status: res.status,
      message: data.message,
    };
  } catch (error) {
    return {
      users: [],
      ...ApiError.generate(error),
    };
  }
};

export const getUserProfile = async (username: string) => {
  try {
    const accessToken = cookies().get("access-token");

    const res = await api.get(`/user/${username}`, {
      headers: {
        Cookie: `access-token=${accessToken?.value}`,
      },
    });
    const data: {
      user: IUser;
      isProfileOwner: boolean;
      message: string;
      publishedArticles: number;
    } = await res.data;

    return {
      ...data,
      status: res.status,
    };
  } catch (error) {
    return {
      ...ApiError.generate(error),
      user: {},
      isProfileOwner: false,
      publishedArticles: 0,
    };
  }
};

export const getUserPersonalArticles = async (
  username: string,
  page: number = 1,
  per_page = 1
) => {
  try {
    // Search Params
    const searchParams = new URLSearchParams("");
    const params: { [key: string]: string | number } = {
      page,
      per_page,
    };
    Object.keys(params).forEach((key) =>
      searchParams.set(key, `${params[key]}`)
    );

    // Access Token
    const accessToken = cookies().get("access-token")?.value;

    if (!accessToken) {
      redirect("/sign-in");
    }

    // Request
    const res = await api.get(
      `/user/articles/${username}?${searchParams.toString()}`,
      {
        headers: {
          Cookie: `access-token=${accessToken}`,
        },
      }
    );

    let data: {
      articles: IArticle[];
      message: string;
      hasNext: boolean;
    } = await res.data;

    const ints = data.articles.map((a) =>
      api.get(`/article/read/interactions/${a.slug}`)
    );

    const interactionsPromise = Promise.all(ints);

    const interactions = await interactionsPromise;

    return {
      ...data,
      status: res.status,
      interactions: interactions.map((r) => r.data),
    };
  } catch (error) {
    return {
      ...ApiError.generate(error),
      articles: [] as IArticle[],
      hasNext: false,
      interactions: [],
    };
  }
};

export const deleteArticle = async (id: string) => {
  try {
    const accessToken = cookies().get("access-token")?.value;

    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const res = await api.delete(`/article/${id}`, {
      headers: {
        Cookie: `access-token=${accessToken}`,
      },
    });

    const data = res.data;

    revalidatePath("/dashboard/blogs");

    return {
      ...data,
      status: res.status,
    };
  } catch (error) {
    console.log(error);
    return {
      ...ApiError.generate(error),
    };
  }
};
