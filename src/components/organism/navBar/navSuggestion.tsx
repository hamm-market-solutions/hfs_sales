import { NavigationTreeItem } from "@/config/navigation";
import { unwrap } from "@/utils/fp-ts";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function NavSuggestion({ suggestion }: { suggestion: NavigationTreeItem }) {
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