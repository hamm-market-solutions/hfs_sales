import { apiRoutePermissions, routePermissions } from "@/config/routes";

export const getGuestRoutes = () => {
  return getRoutesWithPermission(routePermissions, "guest");
};

export const getGuestApiRoutes = () => {
  return getRoutesWithPermission(apiRoutePermissions, "guest");
};

const getRoutesWithPermission = (
  routes: typeof routePermissions | typeof apiRoutePermissions,
  permission: string,
) => {
  let routesWithPermission = [];

  for (const key in routes) {
    if (routes[key].includes(permission)) {
      routesWithPermission.push(key);
    }
  }

  return routesWithPermission;
};
