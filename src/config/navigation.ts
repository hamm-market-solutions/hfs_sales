import { routes } from "./routes";

export const navigatonTree: NavigationTree = [
  {
    key: "dashboard",
    url: routes.dashboard,
    icon: "/assets/icons/dashboard.svg",
    title: "Dashboard",
    description: "View your key metrics.",
  },
  {
    key: "sales",
    title: "Reports",
    items: [
      {
        key: "sales",
        url: routes.sales.reports.forecasts.base,
        icon: "/assets/icons/forecast.svg",
        roles: ["sales"],
        title: "Forecast",
        description:
          "View estimated sales projections, helping to plan and strategize for future performance.",
      }
    ],
  },
];

export type NavigationTree = NavigationTreeItem[];
export type NavigationTreeItem = {
  key: string;
  title: string;
  description?: string;
  icon?: string;
  items?: NavigationTree;
  roles?: string[];
  url?: string;
};
