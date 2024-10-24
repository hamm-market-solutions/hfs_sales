"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import clsx from "clsx";

import Icon from "../../atoms/icons/icon";

import { TableResponse } from "@/types/table";
import ArrowUpIcon from "@/components/atoms/icons/arrowUp";
import ArrowDownIcon from "@/components/atoms/icons/arrowDown";

const fetchSize = 50;

export default function BaseTable<T extends object>({
  columns,
  fetchFn,
}: {
  columns: ColumnDef<T>[];
  fetchFn: (
    start: number,
    size: number,
    sorting: SortingState,
  ) => Promise<TableResponse<T>>;
}) {
  console.log("loading table");

  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  //react-query has a useInfiniteQuery hook that is perfect for this use case
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
    TableResponse<T>
  >({
    queryKey: [
      "table-data",
      sorting, //refetch when sorting changes
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * fetchSize;
      const fetchedData = await fetchFn(start, fetchSize, sorting); //pretend api call

      console.log("fetch data", fetchedData);

      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  console.log("this data", data);

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data],
  );
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    debugTable: true,
  });

  //scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (!!table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  //since this table option is derived from table row model state, we're using the table.setOptions utility
  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  console.log("rows model", rows);
  console.log(rows.length);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  console.log(rowVirtualizer.getTotalSize());

  if (isLoading) {
    return <>Loading...</>;
  }

  const tableHeaderGroups = table.getHeaderGroups();
  const tableHeadersFlattened = tableHeaderGroups.flatMap((headerGroup) => {
    return headerGroup.headers.map((header) => {
      return header;
    });
  });

  return (
    <section className="hfs-table flex flex-col gap-4">
      <div className="table-filters flex flex-row gap-2">
        <Button isIconOnly aria-label="Filters" color="primary" size="lg">
          <Icon alt="Filters" src="/assets/icons/filter.svg" />
        </Button>
        <Input label="Search..." size="sm" type="text" />
      </div>
      <div ref={tableContainerRef} className="table-container">
        <Table>
          <TableHeader>
            {tableHeadersFlattened.map((header) => {
              return (
                <TableColumn
                  key={header.id}
                  style={{
                    width: header.getSize(),
                  }}
                >
                  <div
                    {...{
                      className: clsx(
                        "flex flex-row gap-1 items-center",
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                      ),
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: <ArrowUpIcon className="w-3" />,
                      desc: <ArrowDownIcon className="w-3" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </TableColumn>
              );
            })}
          </TableHeader>
          <TableBody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<T>;

              console.log("row", row);

              return (
                <TableRow
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                  }}
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  // ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
