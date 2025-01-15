import { NavigationTreeItem } from "@/src/config/navigation";
import { unwrap } from "@/src/utils/fp-ts";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function NavSuggestion(
  { suggestion }: { suggestion: NavigationTreeItem },
) {
  return (
    <Button
      as={Link}
      color="primary"
      href={unwrap(suggestion.url)}
      variant="solid"
    >
      {suggestion.title}
    </Button>
  );
}
