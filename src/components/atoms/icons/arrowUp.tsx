import * as O from "fp-ts/Option";
import Icon from "./icon";
import { unwrapOr } from "@/utils/fp-ts";

export default function ArrowUpIcon(
  { className }: { className: O.Option<string> },
) {
  return (
    <Icon
      alt="arrow-up-icon"
      className={unwrapOr(className, "")}
      src="/assets/icons/arrow-up.svg"
    />
  );
}
