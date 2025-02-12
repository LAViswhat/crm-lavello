export interface ImenuItem {
  name: string;
  url: string;
  icon: string;
}

export const MENU_DATA: ImenuItem[] = [
  {
    name: "Home",
    url: "/",
    icon: "mage:dashboard",
  },
  {
    name: "Settings",
    url: "/",
    icon: "lucide:settings",
  },
  {
    name: "Loader",
    url: "/",
    icon: "line-md:loading-alt-loop",
  },
];
