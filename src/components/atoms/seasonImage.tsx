import clsx from "clsx";

import { seasonToShort } from "@/utils/conversions";
import { Option } from "ts-results";

export default function SeasonImage({
    name,
    className,
}: {
  code: number;
  name: Option<string>;
  className: Option<string>;
}) {
    return (
        <div className={clsx("flex flex-col justify-center w-48 h-52", className)}>
            <p className="text-primary text-center text-3xl font-bold">
                {seasonToShort(name.unwrapOr(""))}
            </p>
            {/* <p className="text-secondary text-center text-base">{code}</p> */}
        </div>
    );
}
