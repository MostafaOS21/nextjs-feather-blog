import { TabList } from "@/components/ui/tabs-list";
import { tabs } from "@/helpers/constants";
import { Metadata } from "next";
import React from "react";

export const metadata = (): Metadata => {
  return {
    title: "Read trendy articles now!",
    description: "Most popular articles!",
  };
};

export default function ForYouLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <TabList tabs={tabs} />
      {children}
    </section>
  );
}
