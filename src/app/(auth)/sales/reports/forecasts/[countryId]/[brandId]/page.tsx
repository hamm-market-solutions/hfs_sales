"use client"; // TODO: make server page

import { useParams } from "next/navigation";

export default function Forecast() {
  const params = useParams<{ countryId: string; brandId: string }>();

  return (
    <div className="forecast-page">
      <h2>Forecast</h2>
      <p>Country ID: {params.countryId}</p>
      <p>Brand ID: {params.brandId}</p>
    </div>
  );
}
