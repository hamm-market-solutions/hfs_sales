"use client";

import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import BaseTable from "./table";

import { ForecastTableData } from "@/types/table";
import { getForecastTableData } from "@/actions/reports/forecast";

export default function ForecastTable() {
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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BaseTable
        columns={columns}
        fetchFn={async (start: number, size: number, sorting: SortingState) => {
          return await getForecastTableData({
            start: start,
            size: size,
            sorting: sorting,
            country: params.countryId,
            brand: params.brandId,
            season_code: Number(params.seasonCode),
          });
        }}
      />
    </QueryClientProvider>
  );
}
