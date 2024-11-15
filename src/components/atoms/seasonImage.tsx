import clsx from "clsx";

export default function SeasonImage({
  _code,
  name,
  className,
}: {
  _code: number;
  name?: string;
  className?: string;
}) {
  const [firstSeason, secondSeasonAndYear] = name?.split("/") ?? [];
  const [secondSeason, year] = secondSeasonAndYear.split(" ") ?? [];
  const firstLetterFirstSeason = firstSeason?.charAt(0).toUpperCase();
  const firstLetterSecondSeason = secondSeason?.charAt(0).toUpperCase();

  return (
    <div className={clsx("flex flex-col justify-center w-48 h-52", className)}>
      <p className="text-primary text-center text-3xl font-bold">{`${firstLetterFirstSeason}/${firstLetterSecondSeason} ${year}`}</p>
      {/* <p className="text-secondary text-center text-base">{code}</p> */}
    </div>
  );
}
