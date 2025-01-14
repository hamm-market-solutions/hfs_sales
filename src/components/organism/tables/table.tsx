"use client";

import React from "react";
import { Spinner } from "@nextui-org/spinner";
import { Table, TableBody, TableHeader, TableRow, TableColumn, TableCell, getKeyValue, SortDescriptor } from "@nextui-org/table";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useAsyncList} from "@react-stately/data";

import { TableColumns, TableResponse, TableSort } from "@/types/table";
import { instanceOfOption, instanceOfResult, unwrapOr } from "@/utils/fp-ts";

export default function BaseTable<T extends object>({
    columns,
    fetchUrl
}: {
    columns: TableColumns<T>;
    fetchUrl: URL;
}) {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [hasMore, setHasMore] = React.useState<boolean>(false);
    const [sorting, setSorting] = React.useState<TableSort<T>|undefined>(undefined);
    const [search, _setSearch] = React.useState<string>("");
    // const [nextPageUrl, setNextPageUrl] = React.useState<string>("");

    const list = useAsyncList<T>({
        async load({signal, cursor}) {
            if (cursor) {
                setIsLoading(false);
            }

            // If no cursor is available, then we're loading the first page.
            // Otherwise, the cursor is the next URL to load, as returned from the previous page.
            if (sorting) {
                fetchUrl.searchParams.set("sorting", JSON.stringify(sorting));
            }
            fetchUrl.searchParams.set("search", search);

            console.log("fetchUrl", fetchUrl.toString());
            console.log("cursor", cursor);

            const res = await fetch(cursor || fetchUrl.toString(), {signal});
            const data: TableResponse<T> = (await res.json()).data;

            setHasMore(data.meta.next !== undefined);
            // setNextPageUrl(data.meta.next);

            return {
                items: data.data,
                cursor: data.meta.next,
            };
        },
    });

    const [loaderRef, scrollerRef] = useInfiniteScroll({
        hasMore,
        onLoadMore: list.loadMore,
    });

    return (
        <Table
            isHeaderSticky
            aria-label="Table"
            baseRef={scrollerRef}
            bottomContent={
                hasMore ? (
                    <div className="flex w-full justify-center">
                        <Spinner ref={loaderRef} color="primary" />
                    </div>
                ) : null
            }
            classNames={{
                base: "max-h-[620px]",
                table: "min-h-[500px]",
            }}
            sortDescriptor={sorting as SortDescriptor}
            onSortChange={(sorting) => {
                console.log("onSortChange", sorting);

                setSorting(sorting as TableSort<T>);
                list.reload();
            }}
        >
            <TableHeader>
                {columns.map((column) => (
                    <TableColumn
                        key={column.key.toString()}
                        id={column.key?.toString()}
                        allowsSorting={column.enableSorting}
                    >
                        {column.header}
                    </TableColumn>
                ))}
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                items={list.items}
                loadingContent={<Spinner color="white" />}
            >
                {(item: T) => {
                    const index = list.items.indexOf(item);

                    return (
                        <TableRow key={index}>
                            {(columnKey) => {
                                const column = columns.find((c) => c.key === columnKey);
                                if (column?.cell) {
                                    return (
                                        <TableCell>
                                            {column.cell({value: getKeyValue(item, columnKey), row: item, index})}
                                        </TableCell>
                                    );
                                }

                                return (
                                    <TableCell>
                                        {
                                            instanceOfResult(getKeyValue(item, columnKey)) ||
                                            instanceOfOption(getKeyValue(item, columnKey)) ?
                                                unwrapOr(getKeyValue(item, columnKey), "") :
                                                getKeyValue(item, columnKey)
                                        }
                                    </TableCell>
                                )
                            }}
                        </TableRow>
                    )
                }}
            </TableBody>
        </Table>
    );
}
