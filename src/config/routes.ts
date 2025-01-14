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
                    "[brandId]": {
                        base: "/sales/report/forecast/[countryId]/[brandId]",
                        "[seasonCode]":
              "/sales/report/forecast/[countryId]/[brandId]/[seasonCode]",
                    },
                },
            },
        },
    },
};

export const routePermissions = {
    [routes.login]: ["guest"],
    [routes.dashboard]: ["user"],
    [routes.sales.reports.forecasts.base]: ["forecast.view"],
    [routes.sales.reports.forecasts["[countryId]"]["[brandId]"]["[seasonCode]"]]: ["forecast.view"],
};

export const apiRoutePermissions = {
    [routes.api.auth.login]: {
        roles: ["guest"],
        method: "POST",
    },
    [routes.api.auth.refresh]: {
        roles: ["guest"],
        method: "POST",
    },
};
