"use client";
import { api } from "@/api/api";
import { Input } from "@/components/ui/input";
import Twitter from "@/icons/Twitter";
import { ISocialMedia } from "@/interfaces/IUser";
import { selectAuth } from "@/lib/features/auth/authSlice";
import axios from "axios";
import { Facebook, Github, Globe, Linkedin, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function SocialMediaAccounts() {
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<
    ISocialMedia[]
  >([]);
  const authData = useSelector(selectAuth);

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (authData.username) {
      api
        .get(`/user/social-media/${authData.username}`, {
          cancelToken: source.token,
        })
        .then((res) => {
          setSocialMediaAccounts(res?.data?.socialMediaAccounts || []);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      source.cancel();
    };
  }, [authData]);

  const inputClasses = "py-2  px-3 w-full";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Input
          className={inputClasses}
          placeholder="https://"
          name="youtube"
          defaultValue={
            socialMediaAccounts?.find((a) => a.socialMediaName === "youtube")
              ?.account || ""
          }
        >
          <Youtube />
        </Input>
        <Input
          className={inputClasses}
          placeholder="https://"
          name="facebook"
          defaultValue={
            socialMediaAccounts?.find((a) => a.socialMediaName === "facebook")
              ?.account || ""
          }
        >
          <Facebook />
        </Input>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Input
          className={inputClasses}
          placeholder="https://"
          name="twitter"
          defaultValue={
            socialMediaAccounts?.find((a) => a.socialMediaName === "twitter")
              ?.account || ""
          }
        >
          <Twitter />
        </Input>
        <Input
          className={inputClasses}
          placeholder="https://"
          name="github"
          defaultValue={
            socialMediaAccounts?.find((a) => a.socialMediaName === "github")
              ?.account || ""
          }
        >
          <Github />
        </Input>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Input
          className={inputClasses}
          placeholder="https://"
          name="website"
          defaultValue={
            socialMediaAccounts?.find((a) => a.socialMediaName === "website")
              ?.account || ""
          }
        >
          <Globe />
        </Input>
        <Input
          className={inputClasses}
          placeholder="https://"
          name="linkedin"
          defaultValue={
            socialMediaAccounts?.find((a) => a.socialMediaName === "linkedin")
              ?.account || ""
          }
        >
          <Linkedin />
        </Input>
      </div>
    </>
  );
}
