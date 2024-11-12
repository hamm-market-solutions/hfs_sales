export const routes = {
  api: {
    base: "/api",
    auth: {
      base: "/api/auth",
      login: "/api/auth/login",
      refresh: "/api/auth/refresh",
    },
  },
  login: "/login",
  dashboard: "/dashboard",
  sales: {
    base: "/sales",
    reports: {
      base: "/sales/reports",
      forecasts: {
        base: "/sales/reports/forecasts",
        "[countryId]": {
          base: "/sales/report/forecast/[countryId]",
          "[brandId]": "/sales/report/forecast/[countryId]/[brandId]",
        },
      },
    },
  },
};

export const routePermissions = {
  [routes.login]: ["guest"],
  [routes.dashboard]: ["user"],
  [routes.sales.reports.forecasts.base]: ["forecast.view"],
};

export const apiRoutePermissions = {
  [routes.api.auth.login]: ["guest"],
  [routes.api.auth.refresh]: ["guest"],
};
