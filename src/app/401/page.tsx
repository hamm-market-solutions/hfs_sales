import { Link } from "@nextui-org/link";

import Title from "@/src/components/molecules/title";
import { None } from "@/src/utils/fp-ts";

export default function Page() {
  return (
    <div>
      <Title title="401 - Unauthorized" subtitle={None} />
      <Link href="/dashboard">Go to Dashboard</Link>
    </div>
  );
}
