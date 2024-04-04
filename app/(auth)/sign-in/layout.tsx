import React from "react";
import { Metadata } from "next";
import { serif_font } from "@/app/layout";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Welcome back! Sign in to your account to continue.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-8">
      <h1 className={serif_font.className + " font-semibold"}>Welcome back!</h1>

      {children}
    </section>
  );
}
