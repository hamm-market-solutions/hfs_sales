"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import BaseTable from "./table";

import { ForecastTableColumns, TableColumns } from "@/types/table";
import { phaseToDrop } from "@/utils/conversions";
import EditableCell from "@/components/molecules/editableCell";
import ProductImage from "@/components/molecules/productImage";
import { getForecastTableData } from "@/actions/reports/forecast";

export default function ForecastTable({
    isSeasonActive,
}: {
  isSeasonActive?: boolean;
}) {
    const [editableIndex, setEditableIndex] = useState<number>(-1);
    const params = useParams<{
        countryId: string;
        brandId: string;
        seasonCode: string;
    }>();
    const columns: TableColumns<ForecastTableColumns> = [
        {
            header: "Image",
            key: "img_src",
            cell: (cell) => {
                return (
                    <ProductImage itemNo={cell.row.original.item_no?.toString()} colorCode={cell.row.original.color_code} />
                );
            },
            enableSorting: false,
            size: 60,
        },
        {
            header: "Brand",
            key: "brand_name",
            size: 100,
        },
        {
            header: "Season",
            key: "season_code",
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
            header: "Item No.",
            key: "item_no",
            size: 80,
        },
        {
            header: "Description",
            key: "description",
            size: 200,
            cell: (cell) => {
                return <span className="cut-text">{cell}</span>;
            },
        },
        {
            header: "Item Color",
            key: "color_code",
            size: 100,
        },
        {
            header: "Retail Price",
            key: "rrp",
            cell: (cell) => {
                const price = cell.getValue() as number;

                return (price / 1000).toFixed(2);
            },
            size: 110,
        },
        {
            header: "Estimated Qty.",
            key: "forecast_amount",
            cell: (cell) => {
                const row = cell.row.original;

                if (!isSeasonActive) {
                    return Number(cell.getValue());
                }

                return (
                    <EditableCell<ForecastTableColumns>
                        index={cell.row.index}
                        editableIndex={editableIndex}
                        setEditableIndex={setEditableIndex}
                        className="h-10"
                        initValue={Number(cell.getValue()).toString()}
                        onBlurFocusNext={true}
                        min={0}
                        step={1}
                        submitFn={async (row, value) => {
                            const res = await fetch("/api/sales/reports/forecasts", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    itemNo: row.item_no,
                                    colorCode: row.color_code,
                                    countryCode: params.countryId,
                                    seasonCode: Number(params.seasonCode),
                                    amount: value,
                                }),
                            });
                            const resJson = await res.json();

                            if (resJson.status !== 200) {
                                return resJson;
                            }
                        }}
                        tableRow={row}
                        type="number"
                        variant="bordered"
                    />
                );
            },
            size: 90,
        },
    ];
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <BaseTable<ForecastTableColumns>
                columns={columns}
                fetchFn={(sorting, search) => getForecastTableData(sorting, search, params.countryId, Number(params.brandId), Number(params.seasonCode)).then(
                    (data) => {
                        console.log(data);
                        return data;

                    }
                )}
            />
        </QueryClientProvider>
    );
}
