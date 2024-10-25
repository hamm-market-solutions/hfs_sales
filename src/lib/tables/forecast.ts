import { getForecastItemColorData } from "../models/item_color";

import {
  ForecastTableData,
  ForecastTableRequest,
  TableResponse,
} from "@/types/table";

export const getForecastData = async ({
  start,
  size,
  sorting,
  country,
  brand,
  season_code,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableData>> => {
  const itemColorData = await getForecastItemColorData({
    start,
    size,
    sorting,
    country,
    brand,
    season_code,
  });

  return {
    data: itemColorData.unwrap().map((data) => ({
      img_src: "",
      brand: data.s_item.brand_no,
      season_code: data.s_item.season_code,
      drop: "",
      item_no: data.item_no,
      description: data.s_item.description,
      item_color: data.color_code,
      min_qty_per_order: data.s_item.min_qty_style,
      price: data.purchase_price,
    })),
    meta: { totalRowCount: itemColorData.unwrap().length },
  };
};
