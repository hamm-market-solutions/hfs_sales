import { Option } from "ts-results";
import Icon from "./icon";

export default function ArrowDownIcon({ className }: { className: Option<string> }) {
    return (
        <Icon
            alt="arrow-down-icon"
            className={className.unwrapOr("")}
            src="/assets/icons/arrow-down.svg"
        />
    );
}
