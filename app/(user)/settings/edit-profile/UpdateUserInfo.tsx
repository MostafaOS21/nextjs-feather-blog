"use client";
import { Input } from "@/components/ui/input";
import {
  Mail,
  User,
  AtSign,
  Youtube,
  Facebook,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";
import BioTextArea from "./BioTextArea";
import { cn } from "@/lib/utils";
import Twitter from "@/icons/Twitter";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { api } from "@/api/api";
import { IUser } from "@/interfaces/IUser";
import { useDispatch } from "react-redux";
import { updateData } from "@/lib/features/auth/authSlice";
import toast from "react-hot-toast";
import { ApiError } from "@/helpers/ApiError";
import SocialMediaAccounts from "./SocialMediaAccounts";

interface IProps {
  fullName: string;
  email: string;
  username: string;
  bio: string;
}

export default function UpdateUserInfo({
  fullName,
  email,
  username,
  bio,
}: IProps) {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);

  const inputClasses = "py-2  px-3 w-full";
  const iconSize = "!w-[18px] !h-[18px] text-gray-500";
  const pClasses = "text-gray-500 text-[13px] px-2";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const socialMediaAccounts = [
      {
        socialMediaName: "youtube",
        account: formData.get("youtube"),
      },
      {
        socialMediaName: "facebook",
        account: formData.get("facebook"),
      },
      {
        socialMediaName: "twitter",
        account: formData.get("twitter"),
      },
      {
        socialMediaName: "github",
        account: formData.get("github"),
      },
      {
        socialMediaName: "website",
        account: formData.get("website"),
      },
      {
        socialMediaName: "linkedin",
        account: formData.get("linkedin"),
      },
    ];

    const userData = {
      username: formData.get("username"),
      bio: formData.get("bio"),
      socialMediaAccounts,
    };

    try {
      setIsPending(true);

      const res = await api.post("/user", userData);
      const data = await res.data;

      const { user }: { user: IUser } = data;

      toast.success("User profile updated with success");

      dispatch(updateData(user));
    } catch (error) {
      toast.error(ApiError.generate(error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      className="text-sm font-medium flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          defaultValue={fullName}
          disabled
          className={inputClasses}
          name="fullName"
        >
          <User className={iconSize} />
        </Input>
        <Input
          defaultValue={email}
          disabled
          className={inputClasses}
          name="email"
        >
          <Mail className={iconSize} />
        </Input>
      </div>

      <div className="flex flex-col gap-2">
        <Input
          defaultValue={username}
          className={inputClasses}
          name="username"
          required
        >
          <AtSign className={iconSize} />
        </Input>
        <p className={pClasses}>Username will be used find you in search.</p>
      </div>

      <div className="flex flex-col gap-2">
        <BioTextArea bio={bio} />
      </div>

      <div>
        <p className={cn(pClasses, "text-[14px] !p-0 mb-2")}>
          Add your social handles below
        </p>

        <div className="flex flex-col gap-2">
          <SocialMediaAccounts />
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        Update
      </Button>
    </form>
  );
}
