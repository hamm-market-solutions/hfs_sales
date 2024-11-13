"use client";

import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import BaseTable from "./table";

import { ForecastTableData } from "@/types/table";
import { getForecastTableData, saveForecast } from "@/actions/reports/forecast";
import { phaseToDrop } from "@/utils/conversions";
import TableInput from "@/components/molecules/tableInput";

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
        cell: (cell) => (
          <img
            alt="img"
            className="h-7 self-start"
            src={cell.getValue() as string}
          />
        ),
        enableSorting: false,
        size: 60,
      },
      {
        header: "Brand",
        accessorKey: "brand_name",
        size: 60,
      },
      {
        header: "Season",
        accessorKey: "season_code",
        size: 80,
      },
      {
        header: "Drop",
        cell: (cell) => {
          const row = cell.row.original;
          const drop = phaseToDrop({
            pre_collection: row.pre_collection,
            main_collection: row.main_collection,
            late_collection: row.late_collection,
            Special_collection: row.Special_collection,
          });

          return drop > 0 ? drop : "";
        },
        sortingFn: (a, b) => {
          const dropA = phaseToDrop({
            pre_collection: a.original.pre_collection,
            main_collection: a.original.main_collection,
            late_collection: a.original.late_collection,
            Special_collection: a.original.Special_collection,
          });
          const dropB = phaseToDrop({
            pre_collection: b.original.pre_collection,
            main_collection: b.original.main_collection,
            late_collection: b.original.late_collection,
            Special_collection: b.original.Special_collection,
          });

          return dropA - dropB;
        },
        enableSorting: true,
        size: 60,
      },
      {
        header: "Item No",
        accessorKey: "item_no",
        size: 80,
      },
      {
        header: "Description",
        accessorKey: "description",
        size: 170,
        cell: (cell) => {
          return <span className="cut-text">{cell.getValue<string>()}</span>;
        },
      },
      {
        header: "Item Color",
        accessorKey: "color_code",
        size: 100,
      },
      {
        header: "Min. Qty.",
        accessorKey: "min_qty_style",
        cell: (cell) => {
          const minQty = cell.getValue() as number;

          return minQty / 1000;
        },
        size: 90,
      },
      {
        header: "Price",
        accessorKey: "purchase_price",
        cell: (cell) => {
          const price = cell.getValue() as number;

          return (price / 1000).toFixed(2);
        },
        size: 90,
      },
      {
        header: "Amount",
        cell: (cell) => {
          const row = cell.row.original;

          return (
            <TableInput<ForecastTableData>
              min={0}
              step={1}
              submitFn={(row, value) =>
                saveForecast(row, params.countryId, value)
              }
              tableRow={row}
              type="number"
              variant="bordered"
            />
          );
        },
        size: 100,
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
            brand: Number(params.brandId),
            season_code: Number(params.seasonCode),
          });
        }}
      />
    </QueryClientProvider>
  );
}
