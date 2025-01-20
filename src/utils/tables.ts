import { appConfig } from "@/config/app";
import { TABLE_FETCH_SIZE } from "@/lib/tables/constants";
import { TableFilter, TableRequest } from "@/types/table";
import _ from "lodash";
import { isSome, Option } from "fp-ts/Option";
import { instanceOfOption, instanceOfResult, isOk, None, Some } from "./fp-ts";

export const buildTableUrl = <C extends object, T extends TableRequest<C>>(
  totalRowCount: number,
  path: string,
  tableParams: T,
): [Option<string>, Option<string>] => {
  const requestPage = tableParams.page;
  let requestSorting: string = "";
  if (isSome(tableParams.sorting)) {
    requestSorting = JSON.stringify(tableParams.sorting.value);
  }
  let requestFilters: TableFilter<C>[] = [];
  if (isSome(tableParams.filters)) {
    requestFilters = tableParams.filters.value;
  }
  const remainingRequestParams = _.omit(tableParams, [
    "page",
    "sorting",
    "filters",
  ]) as Record<string, any>;

  const nextPage = requestPage * TABLE_FETCH_SIZE < totalRowCount
    ? `${requestPage + 1}`
    : undefined;
  const previousPage = requestPage > 1 ? `${requestPage - 1}` : undefined;
  const nextUrl = new URL(appConfig.url + path);
  nextUrl.searchParams.set("page", nextPage ?? "");
  nextUrl.searchParams.set("filters", JSON.stringify(requestFilters));
  nextUrl.searchParams.set("sorting", requestSorting);
  Object.entries(remainingRequestParams).forEach(([key, value]) => {
    let val = value;
    if (instanceOfResult(val)) {
      if (isOk(val)) {
        val = val.left;
      } else {
        val = val.right;
      }
    } else if (instanceOfOption(val)) {
      if (isSome(val)) {
        val = val.value;
      } else {
        val = "";
      }
    }
    nextUrl.searchParams.set(
      key,
      value.toString(),
    );
  });
  const previousUrl = new URL(appConfig.url + path);
  previousUrl.searchParams.set("page", previousPage ?? "");
  previousUrl.searchParams.set("filters", JSON.stringify(requestFilters));
  previousUrl.searchParams.set("sorting", requestSorting);
  Object.entries(remainingRequestParams).forEach(([key, value]) => {
    let val = value;
    if (instanceOfResult(val)) {
      if (isOk(val)) {
        val = val.left;
      } else {
        val = val.right;
      }
    } else if (instanceOfOption(val)) {
      if (isSome(val)) {
        val = val.value;
      } else {
        val = "";
      }
    }
    nextUrl.searchParams.set(
      key,
      (value as any).toString(),
    );
  });

  return [
    nextPage ? Some(nextUrl.toString()) : None,
    previousPage ? Some(previousUrl.toString()) : None,
  ];
};
