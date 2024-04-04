import { Separator } from "@/components/ui/separator";
import React from "react";
import SideMenu from "../components/SideMenu";
import RouteProtect from "@/components/providers/RouteProtect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteProtect>
      <div className="section grid grid-cols-[1fr] lg:grid-cols-[200px_10px_1fr]">
        <SideMenu />
        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator orientation="horizontal" className="block lg:hidden" />
        <section className="px-4">{children}</section>
      </div>
    </RouteProtect>
  );
}
