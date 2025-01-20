import Title from "@/components/molecules/title";
import SalesDashboard from "@/components/organism/dashboards/salesDashboard";
import { routes } from "@/config/routes";
import { validateUserAuthorizedOrRedirect } from "@/lib/auth/validations";
import { getCurrentUser } from "@/lib/models/user";
import { getUserRoles } from "@/lib/models/userHasRole";
import { None, Some, unwrap, unwrapOr } from "@/utils/fp-ts";
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
