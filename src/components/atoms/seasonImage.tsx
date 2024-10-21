import clsx from "clsx";

export default function SeasonImage({
  code,
  name,
  className,
}: {
  code: number;
  name?: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-col justify-center w-48 h-52", className)}>
      <p className="text-primary text-center text-8xl font-bold">{code}</p>
      <p className="text-secondary text-center text-base">{name}</p>
    </div>
  );
}
