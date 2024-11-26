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
import { Spinner } from "@nextui-org/spinner";

import Icon from "../../atoms/icons/icon";

import { TableResponse } from "@/types/table";

const fetchSize = 50;

export default function BaseTable<T extends object>({
  columns,
  // fetchFn,
  url,
}: {
  columns: ColumnDef<T>[];
  // fetchFn: (
  //   start: number,
  //   size: number,
  //   sorting: SortingState,
  // ) => Promise<TableResponse<T>>;
  url: [string, string];
}) {
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  //react-query has a useInfiniteQuery hook that is perfect for this use case
  const { data, fetchNextPage, isFetching } = useInfiniteQuery<
    TableResponse<T>
  >({
    queryKey: [
      "table-data",
      sorting, //refetch when sorting changes
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * fetchSize;
      const base = url[0];
      const query = url[1];
      const fetchedData = await fetch(
        `${base}?${query}&start=${start}&size=${fetchSize}&sorting=${JSON.stringify(sorting)}`,
      );
      // const fetchedData = await fetchFn(start, fetchSize, sorting); //pretend api call
      const fetchedDataJson = await fetchedData.json();

      return fetchedDataJson["data"];
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
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

  return (
    <section className="hfs-table flex flex-col p-4 text-sm rounded-2xl bg-white shadow-2xl">
      <div className="table-filters flex flex-row gap-2 mb-4">
        <Button isIconOnly aria-label="Filters" color="primary" size="lg">
          <Icon alt="Filters" src="/assets/icons/filter.svg" />
        </Button>
        <Input label="Search..." size="sm" type="text" />
      </div>
      <div
        ref={tableContainerRef}
        className="table-container"
        style={{
          overflow: "auto", //our scrollable table container
          position: "relative", //needed for sticky header
          height: "600px", //should be a fixed height
        }}
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      >
        <table className="rounded-lg scroll-smooth" style={{ display: "grid" }}>
          <thead
            className="p-4 rounded-lg bg-gray-100"
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ display: "flex", width: "100%" }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        display: "flex",
                        width: header.getSize(),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          "aria-hidden": false,
                          tabIndex: 0, // This makes the element focusable
                          onClick: header.column.getToggleSortingHandler(),
                          onKeyDown: (e) => {
                            // if the key is `Enter`, then toggle sorting
                            if (e.code == "Enter") {
                              header.column.getToggleSortingHandler()!(e);
                            }
                          },
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            className="overflow-hidden"
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: "relative", //needed for absolute positioning of rows
            }}
          >
            {!isFetching ? (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<T>;

                return (
                  <tr
                    key={row.id}
                    ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    className="px-4 py-2 border-b-1 border-gray-200"
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    style={{
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      width: "100%",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="flex-col justify-center"
                          style={{
                            display: "flex",
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>
                  <Spinner />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-2 border-t-1">{`${table.getRowCount()} of ${totalDBRowCount}`}</p>
    </section>
  );
}
