"use client";

import Image from "next/image";
import { IBlogData } from "../article/[[...articleId]]/page";
import toast from "react-hot-toast";

interface IBannerProps {
  setArticleData: React.Dispatch<React.SetStateAction<IBlogData>>;
  banner: {
    clientUrl: string;
    file: File | undefined;
  };
  defaultBanner?: string;
  setIsSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Banner({
  setArticleData,
  banner,
  defaultBanner,
  setIsSaveDisabled,
}: IBannerProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const clientUrl = e.target.result as string;

          setArticleData((prev) => ({
            ...prev,
            banner: { clientUrl, file },
          }));
        }
      };
      reader.readAsDataURL(file);

      setIsSaveDisabled(false);
    } else {
      return toast.error("File is not valid");
    }
  };

  return (
    <div className=" border-4 border-secondary overflow-hidden grid place-content-center w-full h-[240px] md:h-[420px] transition-colors bg-secondary/40 hover:bg-secondary/60 relative">
      <input
        type="file"
        className="cursor-pointer absolute w-full h-full opacity-0 z-10"
        onChange={handleFileChange}
        accept=".png,.jpg,.jpeg"
      />
      <p
        className={`text-3xl text-slate-300 ${
          banner.clientUrl ? "hidden" : "block"
        }`}
      >
        Blog Banner
      </p>
      {banner.clientUrl && (
        <div className="absolute left-0 top-0 w-full h-full object-contain">
          <Image
            src={defaultBanner || banner.clientUrl}
            width={350}
            height={350}
            alt=""
            className={`w-full h-full  ${
              defaultBanner || banner.clientUrl ? "block" : "hidden"
            }`}
          />
        </div>
      )}
    </div>
  );
}
