import { routePermissions, routes } from "./routes";

export const navigatonTree: NavigationTree = [
    {
        key: "dashboard",
        title: "Dashboard",
        description: "View your key metrics.",
        icon: "/assets/icons/dashboard.svg",
        url: routes.dashboard,
    },
    {
        key: "sales",
        title: "Reports",
        items: [
            {
                key: "sales",
                title: "Forecast",
                description:
          "View estimated sales projections, helping to plan and strategize for future performance.",
                icon: "/assets/icons/forecast.svg",
                permissions: routePermissions[routes.sales.reports.forecasts.base],
                url: routes.sales.reports.forecasts.base,
            },
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
  permissions?: string[];
  url?: string;
};
