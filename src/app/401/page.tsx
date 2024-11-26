import { Link } from "@nextui-org/link";

import Title from "@/components/molecules/title";

export default function Page() {
  return (
    <div>
      <Title title="401 - Unauthorized" />
      <Link href="/dashboard">Go to Dashboard</Link>
    </div>
  );
}
