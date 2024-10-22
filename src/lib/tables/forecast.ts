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
}: ForecastTableRequest): Promise<TableResponse<ForecastTableData>> => {
  return {
    data: [
      {
        img_src: "https://via.placeholder.com/150",
        brand: "Gant",
        season_code: "31",
        drop: "Drop 1",
        item_no: 1234,
        description: "Description",
        item_color: "Red",
        min_qty_per_order: 1,
        price: 100,
      },
    ],
    meta: { totalRowCount: 10 },
  };
};
