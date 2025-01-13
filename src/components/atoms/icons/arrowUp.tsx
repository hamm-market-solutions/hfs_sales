import { Option } from "ts-results";
import Icon from "./icon";

export default function ArrowUpIcon({ className }: { className: Option<string> }) {
    return (
        <Icon
            alt="arrow-up-icon"
            className={className.unwrapOr("")}
            src="/assets/icons/arrow-up.svg"
        />
    );
}
