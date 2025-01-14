"use client";

import { useParams } from "next/navigation";
import React, { ReactNode } from "react";

import BaseTable from "./table";

import { ForecastTableColumns, TableColumns } from "@/types/table";
import EditableCell from "@/components/molecules/editableCell";
import ProductImage from "@/components/molecules/productImage";
import { isNone, None, Some, unwrapOr } from "@/utils/fp-ts";
import { Option } from "fp-ts/lib/Option";

export default function ForecastTable({
    isSeasonActive,
}: {
    isSeasonActive: boolean;
}) {
    const params = useParams<{
        countryId: string;
        brandId: string;
        seasonCode: string;
    }>();
    const columns: TableColumns<ForecastTableColumns> = [
        {
            header: "Image",
            key: "img_src",
            cell: ({ row }) => {
                return (
                    <ProductImage itemNo={row.item_no} colorCode={Some(row.color_code)} last={None} />
                );
            },
            enableSorting: false,
            size: Some(60),
            index: None,
        },
        {
            header: "Brand",
            key: "brand_name",
            enableSorting: true,
            size: Some(100),
            index: None,
        },
        {
            header: "Season",
            key: "season_code",
            enableSorting: true,
            size: Some(90),
            index: None,
        },
        {
            header: "Drop",
            key: "drop",
            enableSorting: true,
            size: Some(60),
            index: None,
        },
        {
            header: "Item No.",
            key: "item_no",
            enableSorting: true,
            size: Some(80),
            index: None,
        },
        {
            header: "Description",
            key: "description",
            enableSorting: true,
            size: Some(200),
            cell: ({value}: { value: Option<string> }) => {
                return <p className="cut-text">{unwrapOr(value, "") as unknown as ReactNode}</p>;
            },
            index: None,
        },
        {
            header: "Item Color",
            key: "color_code",
            enableSorting: true,
            size: Some(100),
            index: None,
        },
        {
            header: "Retail Price",
            enableSorting: true,
            key: "rrp",
            cell: ({value}: { value: Option<number> }) => {
                const price = unwrapOr(value, 0);

                return (price / 1000).toFixed(2);
            },
            size: Some(110),
            index: None,
        },
        {
            header: "Estimated Qty.",
            key: "forecast_amount",
            enableSorting: true,
            cell: ({value, row, index}: { value: Option<number>, row: ForecastTableColumns, index: number }) => {
                const val = unwrapOr(value, 0);
                if (!isSeasonActive) {
                    return Number(val);
                }

                return (
                    <EditableCell<ForecastTableColumns>
                        index={index}
                        // editableIndex={editableIndex}
                        // setEditableIndex={setEditableIndex}
                        className="h-10"
                        initValue={Some(Number(val).toString())}
                        onBlurFocusNext={true}
                        min={0}
                        step={1}
                        submitFn={async (row, value) => {
                            if (isNone(row.item_no)) {
                                return { status: 400, message: "Item number is required", cause: None };
                            }

                            const res = await fetch("/api/sales/reports/forecasts", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    itemNo: row.item_no.value,
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
            size: Some(90),
            index: None,
        },
    ];

    const fetchUrl = new URL("http://localhost:3000" + "/api/sales/reports/forecasts/table");
    fetchUrl.searchParams.set("country", params.countryId);
    fetchUrl.searchParams.set("brand", params.brandId);
    fetchUrl.searchParams.set("season_code", params.seasonCode);

    return (
        <BaseTable<ForecastTableColumns>
            columns={columns}
            // fetchFn={async (sorting, search) => {
            //     const t = await getForecastTableData(sorting, search, params.countryId, Number(params.brandId), Number(params.seasonCode));
            //     console.log(t);
            //     return t;

            // }}
            fetchUrl={fetchUrl}
        />
    );
}
