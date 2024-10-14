export const routes = {
  api: {
    base: "/api",
    login: "/api/auth/login",
    refresh: "/api/auth/refresh",
  },
  login: "/login",
  dashboard: "/dashboard",
  sales: {
    base: "/sales",
    report: {
      base: "/sales/report",
      "[countryId]": {
        base: "/sales/report/[countryId]",
        forecast: "/sales/report/[countryId]/forecast",
      },
    },
  },
};

export const publicRoutes = [routes.login];

export const salesPersonRoutes = [routes.sales.report["[countryId]"].forecast];

export const salesRoutes = [...salesPersonRoutes];
