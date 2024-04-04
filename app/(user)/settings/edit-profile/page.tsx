"use client";

import { api } from "@/api/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/helpers/ApiError";
import {
  changeAvatar,
  logOut,
  selectAuth,
} from "@/lib/features/auth/authSlice";
import { generateAvatarUrl } from "@/lib/utils";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import UpdateUserInfo from "./UpdateUserInfo";

export default function EditProfilePage() {
  const authData = useSelector(selectAuth);
  const [selectedFile, setSelectedFile] = useState<{
    client: string;
    file: File | null;
  }>({
    client: "",
    file: null,
  });
  const dispatch = useDispatch();

  // Handle Change Input Image
  const handleChangeImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return toast("Please select proper file.");

    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event?.target?.result) return;

      // @ts-ignore
      setSelectedFile((event) => {
        return {
          client: reader.result,
          file,
        };
      });
    };

    reader.readAsDataURL(file);
  };

  // Handle Uploading Avatar
  const handleUploadingAvatar = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile.file) return toast("You need to select an image");

    if (!authData.id) return toast("Unauthorized");

    const formData = new FormData();

    formData.append("avatar", selectedFile.file);
    formData.append("user_id", authData.id);

    try {
      const res = await api.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.data;

      toast.success("Avatar uploaded successfully");
      dispatch(changeAvatar(data.avatar));
    } catch (error) {
      const err = ApiError.generate(error);
      toast.error(err.message);

      if (err.status === 401) {
        dispatch(logOut());
        window.location.href = "/sign-in";
      }
    }

    setSelectedFile({
      client: "",
      file: null,
    });
  };

  return (
    <>
      <h5>Edit profile</h5>
      <div className="grid grid-cols-[1fr] lg:grid-cols-[170px_1fr] gap-5 py-3">
        <div className="flex flex-col gap-5 mb-3 lg:mb-0 mx-auto lg:mx-0">
          <div className="relative w-[170px] h-[170px] rounded-full overflow-hidden">
            <Avatar className="w-[170px] h-[170px]">
              <AvatarImage
                src={selectedFile.client || generateAvatarUrl(authData.avatar)}
                width={208}
                height={208}
                className="w-full h-full object-cover"
              />
            </Avatar>
            <input
              type="file"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] h-[200vh] cursor-pointer after:content-['Upload'] after:text-white hover:after:opacity-100 after:transition-opacity after:opacity-0 after:flex after:justify-center after:items-center after:text-xl after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-full after:h-full after:bg-[#0000005f]"
              onChange={handleChangeImageFile}
              accept=".png,.jpg,.jpeg"
            />
          </div>
          <Button
            variant={"secondary"}
            className="w-full"
            disabled={!selectedFile.file}
            onClick={handleUploadingAvatar}
          >
            Upload
          </Button>
        </div>

        <UpdateUserInfo
          fullName={authData.fullName}
          username={authData.username}
          email={authData.email}
          bio={authData.bio}
        />
      </div>
    </>
  );
}
