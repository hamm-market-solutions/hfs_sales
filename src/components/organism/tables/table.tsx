"use client";

import React from "react";
import { Spinner } from "@nextui-org/spinner";
import {
  getKeyValue,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";

import {
  TableColumns,
  TableFilter,
  TableResponse,
  TableSort,
} from "@/types/table";
import {
  instanceOfOption,
  instanceOfResult,
  unwrapOr,
} from "@/utils/fp-ts";
import TableFilters from "@/components/molecules/tableFilters";

export default function BaseTable<T extends object>({
  columns,
  fetchUrl,
}: {
  columns: TableColumns<T>;
  fetchUrl: URL;
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [hasMore, setHasMore] = React.useState<boolean>(false);
  const [sorting, setSorting] = React.useState<TableSort<T> | undefined>(
    undefined,
  );
  const [filters, setFilters] = React.useState<TableFilter<T>[]>([]);
  const [useStartFetchUrl, setUseStartFetchUrl] = React.useState<boolean>(
    false,
  );

  const list = useAsyncList<T>({
    async load({ signal, cursor }) {
      if (cursor) {
        setIsLoading(false);
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      let workingFetchUrl: URL;
      if (useStartFetchUrl) {
        workingFetchUrl = fetchUrl;
      } else {
        workingFetchUrl = new URL(cursor || fetchUrl);
      }
      if (sorting) {
        workingFetchUrl.searchParams.set("sorting", JSON.stringify(sorting));
      }
      workingFetchUrl.searchParams.set("filters", JSON.stringify(filters));
      const res = await fetch(workingFetchUrl, { signal });
      const data: TableResponse<T> = (await res.json()).data;

      setUseStartFetchUrl(false);
      setHasMore(!!data.meta.next);

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
    <div className="table-container flex flex-col gap-2">
      <TableFilters
        columns={columns}
        appliedFilters={filters}
        setFilters={(filters: TableFilter<T>[]) => {
          setFilters(filters);
          setUseStartFetchUrl(true);
          list.reload();
        }}
      />
      <Table
        isHeaderSticky
        aria-label="Table"
        baseRef={scrollerRef}
        bottomContent={hasMore
          ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} color="primary" />
            </div>
          )
          : null}
        classNames={{
          base: "max-h-[620px]",
          table: "min-h-[500px]",
        }}
        sortDescriptor={sorting as SortDescriptor}
        onSortChange={(sort) => {
          setUseStartFetchUrl(true);
          setSorting(sort as TableSort<T>);
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
                        {column.cell({
                          value: getKeyValue(item, columnKey),
                          row: item,
                          index,
                        })}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell>
                      {instanceOfResult(getKeyValue(item, columnKey)) ||
                          instanceOfOption(getKeyValue(item, columnKey))
                        ? unwrapOr(getKeyValue(item, columnKey), "")
                        : getKeyValue(item, columnKey)}
                    </TableCell>
                  );
                }}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}
