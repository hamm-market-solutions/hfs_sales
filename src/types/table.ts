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
  brand: number;
  season_code: number;
} & TableRequest;

export type ForecastTableData = {
  imgSrc: string;
  brand_no: string | null;
  brand_name: string | null;
  season_code: number | null;
  pre_collection: number;
  main_collection: number;
  late_collection: number;
  Special_collection: number;
  item_no: string | null;
  description: string | null;
  color_code: string;
  min_qty_style: number | null;
  purchase_price: number | null;
};
