"use client"; // TODO: make server page

import { useParams } from "next/navigation";
import React from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";

import Title from "@/components/molecules/title";
import Table from "@/components/organism/table";
import { getForecastTableData } from "@/actions/reports/forecast";
import { ForecastTableData } from "@/types/table";

export default function Forecast() {
  const params = useParams<{
    countryId: string;
    brandId: string;
    seasonCode: string;
  }>();
  const columns = React.useMemo<ColumnDef<ForecastTableData>[]>(
    () => [
      {
        header: "Image",
        accessorKey: "img_src",
        cell: (cell) => <img alt="img" src={cell.getValue() as string} />,
      },
      {
        header: "Brand",
        accessorKey: "brand",
      },
      {
        header: "Season Code",
        accessorKey: "season_code",
      },
      {
        header: "Drop",
        accessorKey: "drop",
      },
      {
        header: "Item No",
        accessorKey: "item_no",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Item Color",
        accessorKey: "item_color",
      },
      {
        header: "Min. Qty Per Order",
        accessorKey: "min_qty_per_order",
      },
      {
        header: "Price",
        accessorKey: "price",
      },
    ],
    [],
  );

  return (
    <div className="forecast-page">
      <Title subtitle="" title="Forecast" />
      <p>Country ID: {params.countryId}</p>
      <p>Brand ID: {params.brandId}</p>
      <p>Season Code: {params.seasonCode}</p>
      <Table
        columns={columns}
        fetchFn={async (start: number, size: number, sorting: SortingState) => {
          return await getForecastTableData(start, size, sorting, params.brandId, Number(params.seasonCode));
        }}
      />
    </div>
  );
}
