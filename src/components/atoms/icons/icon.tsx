import { Image, ImageProps } from "@heroui/image";
import clsx from "clsx";

export default function Icon({
    src,
    className,
    ...props
}: ImageProps): JSX.Element {
    return (
        <Image
            className={clsx("rounded-none w-10", className)}
            src={src}
            alt="icon"
            {...props}
        />
    );
}
