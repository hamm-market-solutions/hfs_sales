export const matchPath = (route: string, path: string) => {
  const routeParts = route.split("/");
  const pathParts = path.split("/");

  // get rid of path query
  if (pathParts[pathParts.length - 1].includes("?")) {
    pathParts[pathParts.length - 1] =
      pathParts[pathParts.length - 1].split("?")[0];
  }

  if (routeParts.length !== pathParts.length) {
    return false;
  }

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i] === pathParts[i]) {
      continue;
    }

    if (routeParts[i].startsWith("[") && routeParts[i].endsWith("]")) {
      continue;
    }

    return false;
  }

  return true;
};

export const pathIncludes = (route: string, path: string) => {
  const routeParts = route.split("/");
  const pathParts = path.split("/");

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i] === pathParts[i]) {
      continue;
    }

    if (routeParts[i].startsWith("[") && routeParts[i].endsWith("]")) {
      continue;
    }

    return false;
  }

  return true;
};
