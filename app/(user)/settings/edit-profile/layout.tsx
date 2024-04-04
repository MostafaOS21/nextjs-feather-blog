import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata = (): Metadata => {
  return {
    title: "Settings | Edit Profile",
    description: "Edit your profile",
  };
};

export default function EditProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
