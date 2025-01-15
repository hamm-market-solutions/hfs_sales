import * as O from "fp-ts/Option";
import { routePermissions, routes } from "./routes";
import { None, Some } from "@/src/utils/fp-ts";

export const navigationTree: NavigationTree = [
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
        description: Some(
          "View estimated sales projections, helping to plan and strategize for future performance.",
        ),
        icon: Some("/assets/icons/forecast.svg"),
        permissions: Some(
          routePermissions[routes.sales.reports.forecasts.base],
        ),
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
  description: O.Option<string>;
  icon: O.Option<string>;
  items: O.Option<NavigationTree>;
  permissions: O.Option<string[]>;
  url: O.Option<string>;
};
