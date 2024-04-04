import React from "react";
import { Metadata } from "next";
import { serif_font } from "@/app/layout";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for an account",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-8">
      <h1 className={serif_font.className + " font-semibold"}>
        Join us today!
      </h1>

      {children}
    </section>
  );
}
