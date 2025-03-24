import { Folder, Home, Stars } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home, disabled: false },
  {
    href: "/portfolio",
    label: "Portfolio",
    icon: Folder,
    disabled: false,
  },
  {
    href: "/stockquest-ai",
    label: "StockQuest AI",
    icon: Stars,
    disabled: false,
  },
];
