import { appConfig } from "@/config/app";
import { TABLE_FETCH_SIZE } from "@/lib/tables/constants";
import { TableRequest } from "@/types/table";
import _ from "lodash";
import { None, Option, Some } from "ts-results";

export const buildTableUrl = <C, T extends TableRequest<C>>(totalRowCount: number, path: string, tableParams: T): [Option<string>, Option<string>] => {
    const requestPage = tableParams.page;
    const requestSorting = tableParams.sorting;
    const requestSearch = tableParams.search;
    const remainingRequestParams = _.omit(tableParams, ["page", "sorting", "search"]);

    const nextPage = requestPage * TABLE_FETCH_SIZE < totalRowCount ? `${requestPage + 1}` : undefined;
    const previousPage = requestPage > 1 ? `${requestPage - 1}` : undefined;
    const nextUrl = new URL(appConfig.url + path);
    nextUrl.searchParams.set("page", nextPage ?? "");
    nextUrl.searchParams.set("search", requestSearch.unwrapOr(""));
    nextUrl.searchParams.set("sorting", JSON.stringify(requestSorting));
    Object.entries(remainingRequestParams).forEach(([key, value]) => {
        nextUrl.searchParams.set(key, (value as any).toString());
    });
    const previousUrl = new URL(appConfig.url + path);
    previousUrl.searchParams.set("page", previousPage ?? "");
    previousUrl.searchParams.set("search", requestSearch.unwrapOr(""));
    previousUrl.searchParams.set("sorting", JSON.stringify(requestSorting));
    Object.entries(remainingRequestParams).forEach(([key, value]) => {
        previousUrl.searchParams.set(key, (value as any).toString());
    });

    return [nextPage ? Some(nextUrl.toString()) : None, previousPage ? Some(previousUrl.toString()) : None];
}