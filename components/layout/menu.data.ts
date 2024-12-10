export interface ImenuItem {
  name: string;
  url: string;
  icon: string;
}

export const MENU_DATA: ImenuItem[] = [
  {
    name: "Home",
    url: "/",
    icon: "si:dashboard-line",
  },
  {
    name: "Settings",
    url: "/settings",
    icon: "lucide:settings",
  },
];
