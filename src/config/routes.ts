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
    report: {
      base: "/sales/report",
      forecast: {
        base: "/sales/report/forecast",
        "[countryId]": {
          base: "/sales/report/forecast/[countryId]",
          "[brandId]": "/sales/report/forecast/[countryId]/[brandId]",
        },
      },
    },
  },
};

export const publicRoutes = [
  routes.login,
  routes.api.auth.login,
  routes.api.auth.refresh,
];

export const salesPersonRoutes = [
  routes.sales.report.forecast.base,
  routes.sales.report.forecast["[countryId]"]["[brandId]"],
];

export const salesRoutes = [...salesPersonRoutes];

export function permission(permission: string) {
  return function (target: any, propertyKey: string) {
    if (!target.permissions) {
      target.permissions = {};
    }
    target.permissions[propertyKey] = permission;
  };
}
