import { None, Option, Some } from "ts-results";
import { routePermissions, routes } from "./routes";

export const navigatonTree: NavigationTree = [
    {
        key: "dashboard",
        title: "Dashboard",
        description: Some("View your key metrics."),
        icon: Some("/assets/icons/dashboard.svg"),
        url: Some(routes.dashboard),
        items: None,
        permissions: None,
    },
    {
        key: "sales",
        title: "Reports",
        items: Some([
            {
                key: "sales",
                title: "Forecast",
                description:
          Some("View estimated sales projections, helping to plan and strategize for future performance."),
                icon: Some("/assets/icons/forecast.svg"),
                permissions: Some(routePermissions[routes.sales.reports.forecasts.base]),
                url: Some(routes.sales.reports.forecasts.base),
                items: None,
            },
        ]),
        icon: None,
        permissions: None,
        url: None,
        description: None,
    },
];

export type NavigationTree = NavigationTreeItem[];
export type NavigationTreeItem = {
  key: string;
  title: string;
  description: Option<string>;
  icon: Option<string>;
  items: Option<NavigationTree>;
  permissions: Option<string[]>;
  url: Option<string>;
};
