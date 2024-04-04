import {
  FileText,
  Bell,
  NotebookPen,
  User,
  Lock,
  LucideIcon,
} from "lucide-react";

export interface ILinkItem {
  route: string;
  icon: LucideIcon;
  title: string;
}

export const dashboardLinksItems = [
  {
    route: "/dashboard/blogs",
    icon: FileText,
    title: "Blogs",
  },
  {
    route: "/dashboard/notifications",
    icon: Bell,
    title: "Notifications",
  },
  {
    route: "/article",
    icon: NotebookPen,
    title: "Write",
  },
];

export const settingsLinksItems = [
  {
    route: "/settings/edit-profile",
    icon: User,
    title: "Edit Profile",
  },
  {
    route: "/settings/change-password",
    icon: Lock,
    title: "Change Password",
  },
];
