import {
  getForecastItemColorData,
  getForecastItemColorDataCount,
} from "../models/itemColor";

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
  const itemColorDataCount = await getForecastItemColorDataCount({
    country,
    brand,
    season_code,
  });

  return {
    data: itemColorData.unwrap().map((data) => ({
      img_src: `https://hfs.hamm-footwear.com/purchase/item/picture?item_no=${data.item_no}&color=${data.color_code}`,
      brand_no: data.s_item.brand_no,
      brand_name: "",
      season_code: data.s_item.season_code,
      pre_collection: data.pre_collection,
      main_collection: data.main_collection,
      late_collection: data.late_collection,
      Special_collection: data.Special_collection,
      item_no: data.item_no,
      description: data.s_item.description,
      color_code: data.color_code,
      min_qty_style: data.s_item.min_qty_style,
      purchase_price: data.purchase_price,
    })),
    meta: { totalRowCount: itemColorDataCount.unwrap() },
  };
};
