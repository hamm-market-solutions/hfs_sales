import { unwrapOr } from "@/utils/fp-ts";
import { Option } from "fp-ts/Option";

export default function Title({
    title,
    subtitle,
}: {
  title: string;
  subtitle: Option<string>;
}) {
    return (
        <>
            <h2 className="title text-secondary">{title}</h2>
            <h3 className="subtitle text-sm text-primary mb-4">{unwrapOr(subtitle, "")}</h3>
        </>
    );
}
