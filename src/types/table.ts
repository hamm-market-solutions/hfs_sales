import { SortingState } from "@tanstack/react-table";

export type TableResponse<T extends object> = {
  data: T[];
  meta: { totalRowCount: number };
};

export type TableRequest = {
  start: number;
  size: number;
  sorting: SortingState;
};

export type ForecastTableRequest = {
  brand: string;
  season_code: number;
} & TableRequest;

export type ForecastTableData = {
  img_src: string;
  brand: string;
  season_code: string;
  drop: string;
  item_no: number;
  description: string;
  item_color: string;
  min_qty_per_order: number;
  price: number;
};
