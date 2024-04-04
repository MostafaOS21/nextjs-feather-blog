export interface ISocialMedia {
  socialMediaName:
    | "youtube"
    | "facebook"
    | "twitter"
    | "github"
    | "website"
    | "linkedin";
  account: string;
  _id: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  blogsPublished: number;
  reads: number;
  bio: string;
  avatar: string;
  // social Media
  joinDate: string;
  socialMediaAccounts: ISocialMedia[];
}
