export default function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <>
      <h2 className="title text-2xl text-secondary font-bold">{title}</h2>
      <p className="subtitle text-sm text-primary mb-4">{subtitle}</p>
    </>
  );
}
