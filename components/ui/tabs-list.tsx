"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { ReactNode } from "react";

export interface ITab {
  route: string;
  title: string;
  isSmallScreens?: boolean;
}

export function TabList({ tabs }: { tabs: ITab[] }) {
  const pathname = usePathname();

  // Move Underline Indicator
  // function moveIndicator(newTab: HTMLElement) {
  //   const tabsContainer = document.querySelector(
  //     "[role='tablist']"
  //   ) as HTMLDivElement;

  //   tabsContainer.style.setProperty("--_left", newTab.offsetLeft + "px");
  // }

  return (
    <div /* role="tablist" */>
      {tabs.map((tab, index) => (
        <Button
          variant={"ghost"}
          asChild
          className={`!rounded-none !p-3 font-medium text-sm ${
            pathname === tab.route && "border-b-[1.4px] border-zinc-900"
          } ${tab.isSmallScreens && "block lg:hidden"} `} /*  */
          key={index}
        >
          <Link
            href={tab.route}
            // onClick={(e) => moveIndicator(e.target as HTMLElement)}
          >
            {tab.title}
          </Link>
        </Button>
      ))}
    </div>
  );
}
