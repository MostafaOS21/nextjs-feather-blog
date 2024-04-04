import { ITab } from "@/components/ui/tabs-list";

export const avatarMenuItems = [
  {
    route: "/user",
    name: "Profile",
  },
  {
    route: "/dashboard/blogs",
    name: "Dashboard",
  },
  {
    route: "/settings/edit-profile",
    name: "Settings",
  },
];

export const googleUrl = "google";

// Reading Page Tabs
export const tabs: ITab[] = [
  {
    route: "/",
    title: "Home",
  },
  {
    route: "/trending",
    isSmallScreens: true,
    title: "Trending",
  },
  // {
  //   route: "/for-you",
  //   isSmallScreens: true,
  //   title: "For you",
  // },
];
