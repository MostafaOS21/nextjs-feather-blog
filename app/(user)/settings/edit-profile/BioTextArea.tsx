"use client";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";
import { selectAuth } from "@/lib/features/auth/authSlice";

const BIO_MAX_LENGTH = 200;

export default function BioTextArea({ bio: bioValue }: { bio: string }) {
  const authData = useSelector(selectAuth);

  const [bio, setBio] = useState<string>(authData.bio);
  const debounced = debounce((value: string) => {
    setBio(value);
  }, 300);

  return (
    <>
      <Textarea
        className="w-full !h-[140px] resize-none"
        onChange={(e) => debounced(e.target.value)}
        name="bio"
        defaultValue={bio}
        placeholder={bio ? "" : "Tell us about yourself "}
      ></Textarea>
      <p className={"text-gray-500 text-[13px] px-1"}>
        {BIO_MAX_LENGTH - bio.length} characters left
      </p>
    </>
  );
}
