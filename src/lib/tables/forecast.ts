import {
  ForecastTableData,
  ForecastTableRequest,
  TableResponse,
} from "@/types/table";

export const getForecastData = async ({
  start,
  size,
  sorting,
  brand,
  season_code,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableData>> => {};
