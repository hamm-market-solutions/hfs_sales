import Title from "@/components/molecules/title";
import { routes } from "@/config/routes";
import { validateUserAuthorizedOrRedirect } from "@/lib/auth/validations";
import { cookies } from "next/headers";

export default async function Dashboard() {
  await validateUserAuthorizedOrRedirect(routes.dashboard);

  return (
    <div className="dashboard-page">
      <Title title="Dashboard" />
    </div>
  );
}
