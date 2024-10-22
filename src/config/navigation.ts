import { routes } from "./routes";

export const navigatonTree = {
  dashboard: "/dashboard",
  reports: {
    forecast: {
      url: routes.sales.reports.forecasts.base,
      icon: "/assets/icons/forecast.svg",
      roles: ["sales"],
      title: "Forecast",
      description:
        "View estimated sales projections, helping you plan and strategize for future performance.",
    },
  },
};
