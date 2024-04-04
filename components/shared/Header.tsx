"use client";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { PencilLine, Search, X } from "lucide-react";
import AuthButtons from "./AuthButtons";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuth } from "@/lib/features/auth/authSlice";

export const Logo = () => (
  <Link className="w-[32px] h-[32px] block" href={"/"}>
    <Image
      src={"/assets/images/feather.png"}
      width={100}
      height={100}
      alt="Feather log"
      className="w-full h-full"
    />
  </Link>
);

export default function Header() {
  const pathname = usePathname();
  const authData = useSelector(selectAuth);
  const router = useRouter();

  if (pathname.includes("/article")) return null;

  const showHideSearch = (action: "show" | "hide") => {
    const form = document.getElementById("searchForm") as HTMLFormElement;

    if (!form) return;

    if (action === "show") {
      form.classList.add("translate-y-0");
    } else {
      form.classList.remove("translate-y-0");
    }
  };

  return (
    <header className="relative">
      <div className="flex gap-8 items-center">
        <Logo />

        <form
          className="absolute px-3 -translate-y-40 lg:translate-y-0 lg:px-0 w-full h-full left-1/2 -translate-x-1/2 lg:translate-x-0 z-[666666] lg:h-fit lg:z-[1] lg:w-fit lg:static flex items-center gap-1 bg-white transition-transform"
          onSubmit={(e) => {
            e.preventDefault();
            const search = new FormData(e.target as any).get(
              "search"
            ) as string;

            if (!search) return;

            router.push(`/search/${search}`);
          }}
          id="searchForm"
        >
          <Input
            type="text"
            placeholder="Search"
            className="rounded-full focus-within:bg-secondary py-[10px] px-3  flex-1 lg:flex-none"
            name="search"
          >
            <Search className="opacity-25" />
          </Input>

          <Button
            className="!p-[13px] lg:hidden"
            variant={"secondary"}
            onClick={() => showHideSearch("hide")}
            type="button"
          >
            <X size={18} />
          </Button>
        </form>
      </div>

      <div className="flex gap-3 items-center">
        <Button
          variant={"secondary"}
          className="!p-[13px] lg:hidden"
          onClick={() => showHideSearch("show")}
        >
          <Search size={18} />
        </Button>

        {/* Write Article Link Large Screen */}
        <Button
          asChild
          variant={"ghost"}
          className="text-slate-500 hidden lg:flex"
        >
          <Link
            href={authData.isAuth ? "/article" : "/sign-in"}
            className="items-center"
          >
            <PencilLine size={18} className="me-2" /> <span>Write</span>
          </Link>
        </Button>
        {/* Write Article Link Less Than Large Screen */}
        <Button asChild variant={"secondary"} className="!p-[13px] lg:hidden">
          <Link href={"/article"}>
            <PencilLine size={18} />
          </Link>
        </Button>
        {/* Auth Buttons */}
        <AuthButtons />
      </div>
    </header>
  );
}
