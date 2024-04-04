import { googleUrl } from "@/helpers/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateAvatarUrl = (avatar: string) => {
  if (avatar?.includes(googleUrl)) {
    return avatar;
  } else {
    return `${process.env.NEXT_PUBLIC_API_URL}/avatars${avatar}`;
  }
};

export const slicingText = (text: string, length: number = 25) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
