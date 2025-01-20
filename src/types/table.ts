import React from "react";
import { Option } from "fp-ts/Option";

export interface TableResponse<T extends object> {
  data: T[];
  meta: { totalRowCount: number, next?: string, previous?: string };
};

export type TableSortDirection = "ascending" | "descending";

export type TableSort<T extends object> = { column: keyof T, direction: TableSortDirection };
export type TableFilter<T extends object> = { column: keyof T, value: string };

export interface TableRequest<T extends object> {
  page: number;
  sorting: Option<TableSort<T>>;
  filters: Option<TableFilter<T>[]>;
};

export type TableColumns<T extends object> = {
  header: string;
  key: keyof T;
  enableSorting: boolean;
  enableFiltering: boolean;
  cell?: (props: {
    value: any;
    row: T;
    index: number
  }) => React.ReactNode;
  sortingFn?: (a: { original: T }, b: { original: T }) => number;
  size: Option<number>;
  index: Option<number>;
}[];

export interface ForecastTableRequest extends TableRequest<ForecastTableColumns> {
  country: string;
  brand: number;
  season_code: number;
};

export interface ForecastTableColumns {
  img_src: [Option<string>, Option<string>, Option<string>];
  pre_collection: number;
  main_collection: number;
  late_collection: number;
  special_collection: number;
  drop: number;
  color_code: string;
  color_name: string;
  brand_no: Option<string>;
  brand_name: Option<string>;
  season_code: Option<number>;
  season_name: Option<string>;
  item_no: Option<string>;
  description: Option<string>;
  rrp: Option<number>;
  wsp: Option<number>;
  forecast_amount: Option<number>;
};
