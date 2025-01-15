import * as O from "fp-ts/Option";
import Icon from "./icon";
import { pipe } from "fp-ts/lib/function";

export default function ArrowDownIcon(
  { className }: { className: O.Option<string> },
) {
  const classN = pipe(
    className,
    O.map((c) => c),
    O.getOrElse(() => ""),
  );

  return (
    <Icon
      alt="arrow-down-icon"
      className={classN}
      src="/assets/icons/arrow-down.svg"
    />
  );
}
