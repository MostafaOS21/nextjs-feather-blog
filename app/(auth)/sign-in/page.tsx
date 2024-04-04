"use client";
import { KeyRound, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logIn } from "@/lib/features/auth/authSlice";
import { ApiError } from "@/helpers/ApiError";
import { signIn, signOut } from "@/app/actions";
import { api } from "@/api/api";

export default function SignInPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Set loading state
    setIsLoading(true);

    try {
      const data = await signIn({ email, password });

      if (data.status === 200) {
        toast.success(data.message);
        dispatch(logIn(data));
        window.location.href = "/";
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(ApiError.generate(error).message);
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        method="post"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          type="email"
          placeholder="Email"
          className="w-[310px]"
          customClass="w-[310px]"
          name="email"
          maxLength={64}
          title="Email must be between 0 and 64 characters long."
          pattern="^.{0,64}$"
          required
          disabled={isLoading}
        >
          <Mail />
        </Input>

        <PasswordInput
          type="password"
          placeholder="Password"
          className="w-[310px]"
          customClass="w-[310px]"
          name="password"
          title="Password must be at least 8 characters long."
          pattern="^.{8,}$"
          required
          disabled={isLoading}
        >
          <KeyRound />
        </PasswordInput>

        <Button type="submit" disabled={isLoading}>
          Sign in
        </Button>
      </form>

      <div
        className="relative before:absolute before:content-[''] before:left-0 before:top-1/2 before:-translate-x-1/2
      h-[1px] before:w-full bg-zinc-200 flex justify-center items-center my-6  w-[310px]"
      >
        <span className="bg-white text-zinc-200 px-3">OR</span>
      </div>

      <form
        action={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
        method="get"
      >
        <Button
          className="w-[310px] flex items-center gap-5"
          disabled={isLoading}
        >
          <Image
            src={"/assets/images/google.png"}
            width={20}
            height={20}
            alt="Google icon"
          />
          Continue with Google
        </Button>
      </form>
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link href={"/sign-up"} className="underline font-semibold">
          Sign up here
        </Link>
      </p>
    </>
  );
}
