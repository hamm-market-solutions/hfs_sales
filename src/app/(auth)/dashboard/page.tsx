import Title from "@/components/molecules/title";
import SalesDashboard from "@/components/organism/dashboards/salesDashboard";
import { routes } from "@/config/routes";
import { validateUserAuthorizedOrRedirect } from "@/lib/auth/validations";
import { getCurrentUser } from "@/lib/models/user";
import { getUserRoles } from "@/lib/models/userHasRole";

export default async function Dashboard() {
    await validateUserAuthorizedOrRedirect(routes.dashboard);
    const user = (await getCurrentUser()).unwrap();
    const userRoles = (await getUserRoles(user.id)).unwrap();
    let dashboardComponent = null;

    if (
        userRoles.roles.some((r) => r.roleName === "sale" || r.roleName === "admin")
    ) {
        dashboardComponent = <SalesDashboard />;
    }

    return (
        <div className="dashboard-page">
            <Title title="Dashboard" />
            {dashboardComponent}
        </div>
    );
}
