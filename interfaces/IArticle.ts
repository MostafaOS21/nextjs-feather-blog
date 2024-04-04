import { IUser } from "./IUser";

export interface IArticle {
  _id: string;
  banner: string;
  title: string;
  content: any[];
  description: string;
  tags: string[];
  createdAt: string;
  isPublished: boolean;
  likes: Record<string, boolean>;
  author: IUser;
  likesCount: number;
  commentsCount: number;
  slug: string;
}
