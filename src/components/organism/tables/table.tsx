import React from "react";
import { Spinner } from "@nextui-org/spinner";
import { Table, TableBody, TableHeader, TableRow, TableColumn, TableCell, getKeyValue } from "@nextui-org/table";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useAsyncList} from "@react-stately/data";

import { TableColumns, TableResponse, TableSorting } from "@/types/table";
import { HfsResult } from "@/lib/errors/HfsError";

export default function BaseTable<T extends object>({
    columns,
    fetchFn,
}: {
    columns: TableColumns<T>;
    fetchFn: (
        sorting: TableSorting<T>,
        search: string
    ) => Promise<HfsResult<TableResponse<T>>>;
}) {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [hasMore, setHasMore] = React.useState<boolean>(false);
    const [sorting, setSorting] = React.useState<TableSorting<T>>([]);
    const [search, setSearch] = React.useState<string>("");

    let list = useAsyncList<T>({
        async load({signal: _signal, cursor}) {
            if (cursor) {
                setIsLoading(false);
            }

            // If no cursor is available, then we're loading the first page.
            // Otherwise, the cursor is the next URL to load, as returned from the previous page.
            const res = await fetchFn(sorting, search);
            console.log(res);


            if (res.err) {
                throw new Error(res.val.message);
            }

            setHasMore(res.val.meta.next !== null);

            return {
                items: res.val.data,
                cursor: res.val.meta.next,
            };
        },
    });

    const [loaderRef, scrollerRef] = useInfiniteScroll({
        hasMore,
        onLoadMore: list.loadMore,
    });
    console.log(list.items);


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
                base: "max-h-[520px] overflow-scroll",
                table: "min-h-[400px]",
            }}
        >
            <TableHeader>
                {columns.map((column) => (
                    <TableColumn
                        key={column.key?.toString()}
                        id={column.key?.toString()}
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
                {(item: T) => (
                    <TableRow key={item.key}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
