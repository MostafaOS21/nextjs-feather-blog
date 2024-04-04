"use client";
import { Input } from "@/components/ui/input";
import { User, Mail, KeyRound } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { signUp } from "@/app/actions";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Handle Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validation
    if (!fullName || !email || !password) {
      return toast("Please fill in all the fields");
    }

    // Set loading state
    setIsLoading(true);
    let toastId: string = toast.loading("Signing up...");

    try {
      const res = await signUp({ fullName, email, password });
      if (res?.status !== 201 && res?.message) {
        toast.error(res.message);
      } else {
        toast.success("Signed up successfully");
        window.location.href = "/sign-in";
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
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
          placeholder="Full name"
          className="w-[310px]"
          customClass="w-[310px]"
          name="fullName"
          title="Full name must be between 3 and 20 characters long."
          pattern="^(?=.{3,20}$).*"
          required
          disabled={isLoading}
        >
          <User />
        </Input>
        <Input
          type="email"
          placeholder="Email"
          className="w-[310px]"
          customClass="w-[310px]"
          name="email"
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
          Sign up
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
        Already have an account?{" "}
        <Link href={"/sign-in"} className="underline font-semibold">
          Sign in here
        </Link>
      </p>
    </>
  );
}
