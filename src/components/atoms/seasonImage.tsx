export default function SeasonImage({
  code,
  name,
}: {
  code: string;
  name: string;
}) {
  return (
    <svg
      height="500px"
    //   viewBox="0 0 500 500"
      width="500px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        style={{
          fill: "rgb(51, 51, 51)",
          fontFamily: "Arial, sans-serif",
          fontSize: "130px",
          fontWeight: 700,
        //   whiteSpace: "pre",
        }}
        x="25%"
        y="80%"
      >
        {code}
      </text>
    </svg>
  );
}
