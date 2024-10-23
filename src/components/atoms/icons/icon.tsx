import { Image, ImageProps } from "@nextui-org/image";
import clsx from "clsx";

export default function Icon({
  src,
  className,
}: ImageProps): JSX.Element {
  return (
    <Image
      className={clsx("rounded-none w-10", className)}
      src={src}
    />
  );
}
