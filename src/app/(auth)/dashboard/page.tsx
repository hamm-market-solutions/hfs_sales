import Title from "@/src/components/molecules/title";
import SalesDashboard from "@/src/components/organism/dashboards/salesDashboard";
import { routes } from "@/src/config/routes";
import { validateUserAuthorizedOrRedirect } from "@/src/lib/auth/validations";
import { getCurrentUser } from "@/src/lib/models/user";
import { getUserRoles } from "@/src/lib/models/userHasRole";
import { None, Some, unwrap, unwrapOr } from "@/src/utils/fp-ts";
import { Option } from "fp-ts/lib/Option";

export default async function Dashboard() {
  await validateUserAuthorizedOrRedirect(Some(routes.dashboard));
  const user = unwrap(await getCurrentUser());
  const userRoles = unwrap(await getUserRoles(user.id));
  let dashboardComponent: Option<JSX.Element> = None;

  if (
    userRoles.roles.some((r) => {
      return unwrapOr(r.roleName, "") == "sale" ||
        unwrapOr(r.roleName, "") == "admin";
    })
  ) {
    dashboardComponent = Some(<SalesDashboard />);
  }

  return (
    <div className="dashboard-page">
      <Title title="Dashboard" subtitle={None} />
      {unwrapOr(dashboardComponent, null)}
    </div>
  );
}
