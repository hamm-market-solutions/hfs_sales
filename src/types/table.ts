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
  country: string;
  brand: string;
  season_code: number;
} & TableRequest;

export type ForecastTableData = {
  img_src: string;
  brand: string|null;
  season_code: number|null;
  drop: string;
  item_no: string|null;
  description: string|null;
  item_color: string;
  min_qty_per_order: number|null;
  price: number|null;
};
