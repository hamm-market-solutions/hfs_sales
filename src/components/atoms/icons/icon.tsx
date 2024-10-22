import { Image, ImageProps } from "@nextui-org/image";
import clsx from "clsx";

export default function Icon({
  src,
  className,
  width = 40,
  ...props
}: ImageProps): JSX.Element {
  return (
    <Image
      className={clsx("rounded-none", className)}
      src={src}
      width={width}
      {...props}
    />
  );
}
