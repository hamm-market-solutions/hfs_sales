"use client";

import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Image } from "@nextui-org/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";

import BaseTable from "./table";

import { ForecastTableData } from "@/types/table";
import { getForecastTableDataAction, saveForecast } from "@/actions/reports/forecast";
import { phaseToDrop } from "@/utils/conversions";
import EditableCell from "@/components/molecules/editableCell";

export default function ForecastTable() {
  console.log("ForecastTable");

  const params = useParams<{
    countryId: string;
    brandId: string;
    seasonCode: string;
  }>();
  console.log("params", params);

  const columns = React.useMemo<ColumnDef<ForecastTableData>[]>(
    () => [
      {
        header: "Image",
        accessorKey: "img_src",
        cell: (cell) => {
          const { isOpen, onOpen, onOpenChange } = useDisclosure();

          return (
            <>
              <Image
                alt="img"
                className="h-10 w-10 self-start"
                fallbackSrc="/assets/img-placeholder.svg"
                radius="sm"
                src={cell.getValue() as string}
                onClick={onOpen}
              />
              <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              >
                <ModalContent>
                  <ModalHeader className="flex flex-col gap-1">
                    Product Image
                  </ModalHeader>
                  <ModalBody className="flex flex-row justify-center">
                    <Image
                      alt="img"
                      className="h-36 w-36"
                      fallbackSrc="/assets/img-placeholder.svg"
                      src={cell.getValue() as string}
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          );
        },
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
        accessorKey: "season_name",
        size: 90,
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
        accessorKey: "forecast_amount",
        cell: (cell) => {
          const row = cell.row.original;

          console.log();

          return (
            <EditableCell<ForecastTableData>
              className="h-10"
              initValue={Number(cell.getValue()).toString()}
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
        size: 90,
      },
    ],
    [],
  );
  console.log("columns defined");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  console.log("queryClient defined");

  return (
    <QueryClientProvider client={queryClient}>
      <BaseTable
        columns={columns}
        fetchFn={async (start: number, size: number, sorting: SortingState) => {
          console.log("fetchFn", start, size, sorting);

          return await getForecastTableDataAction({
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
