import { ImageProps } from "next/image";
import Icon from "./icon";

export default function ArrowDownIcon({className}:{className?: string}) {
      return <Icon alt="arrow-down-icon" src="/assets/icons/arrow-down.svg" className={className} />
}