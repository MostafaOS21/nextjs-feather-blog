"use client";
import { ILinkItem, dashboardLinksItems, settingsLinksItems } from "../links";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Link List
const LinksList = ({ items }: { items: ILinkItem[] }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-[0.7px]">
      {items.map((item, index) => (
        <Button
          key={index}
          variant={"ghost"}
          className={
            "w-full flex justify-start gap-3 !rounded-none !py-4 !px-6 border-zinc-900 " +
            (pathname === item.route
              ? "border-b-2 lg:border-b-0 lg:border-r-2 bg-secondary"
              : "")
          }
          asChild
        >
          <Link href={item.route}>
            {<item.icon size={17} />} {item.title}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default function SideMenu() {
  return (
    <aside>
      {/* Dashboard */}
      <div className="mb-3 py-1 relative after:absolute after:content-[''] after:bottom-0 after:h-[1px] after:w-[95%] after:bg-gray-200  after:left-1/2 after:-translate-x-1/2">
        <h5 className="font-medium text-gray-600 pb-2 px-3">Dashboard</h5>
      </div>

      <LinksList items={dashboardLinksItems} />
      {/* Settings Pages */}
      <div className="mb-3 py-1 relative after:absolute after:content-[''] after:bottom-0 after:h-[1px] after:w-[95%] after:bg-gray-200  after:left-1/2 after:-translate-x-1/2">
        <h5 className="font-medium text-gray-600 pb-2 px-3">Settings</h5>
      </div>
      <LinksList items={settingsLinksItems} />
    </aside>
  );
}
