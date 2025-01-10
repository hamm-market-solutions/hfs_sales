export type TableResponse<T extends object> = {
  data: T[];
  meta: { totalRowCount: number, next?: string, previous?: string };
};

export type TableSorting<T> = { id: keyof T; desc: boolean }[];

export type TableRequest<T> = {
  sorting: TableSorting<T>;
  search?: string;
};

export type TableColumns<T> = {
  header: string;
  key?: keyof T;
  cell?: (cell: any) => React.ReactNode;
  enableSorting?: boolean;
  sortingFn?: (a: { original: T }, b: { original: T }) => number;
  size?: number;
}[];

export type ForecastTableRequest = {
  country: string;
  brand: number;
  season_code: number;
} & TableRequest<ForecastTableColumns>;

export interface ForecastTableColumns {
  img_src: [string?, string?, string?];
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
  rrp: number | null;
  wsp: number | null;
  forecast_amount: number | null;
};
