import clsx from "clsx";

import { seasonToShort } from "@/utils/conversions";
import * as O from "fp-ts/Option";
import { unwrapOr } from "@/utils/fp-ts";

export default function SeasonImage({
    name,
    className,
}: {
  code: number;
  name: O.Option<string>;
  className: O.Option<string>;
}) {
    const n = unwrapOr(name, "");
    return (
        <div className={clsx("flex flex-col justify-center w-48 h-52", className)}>
            <p className="text-primary text-center text-3xl font-bold">
                {unwrapOr(seasonToShort(n), null)}
            </p>
            {/* <p className="text-secondary text-center text-base">{code}</p> */}
        </div>
    );
}
