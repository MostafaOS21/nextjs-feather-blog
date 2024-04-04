import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata = (): Metadata => {
  return {
    title: "Settings | Change Password",
    description: "Change your password",
  };
};

export default function ChangePasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
