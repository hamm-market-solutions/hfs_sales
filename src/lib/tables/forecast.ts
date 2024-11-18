import {
  getForecastTableData,
  getForecastTableCount,
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
  const itemColorData = await getForecastTableData({
    start,
    size,
    sorting,
    country,
    brand,
    season_code,
  });

  const itemColorDataCount = await getForecastTableCount({
    brand,
    season_code,
  });

  return {
    data: itemColorData.unwrap().map((data) => ({
      img_src: `https://hfs.hamm-footwear.com/purchase/item/picture?item_no=${data.itemNo}&color=${data.colorCode}`,
      brand_no: data.brandNo,
      brand_name: "",
      season_code: data.seasonCode,
      pre_collection: data.preCollection,
      main_collection: data.mainCollection,
      late_collection: data.lateCollection,
      Special_collection: data.specialCollection,
      item_no: data.itemNo,
      description: data.description,
      color_code: data.colorCode,
      min_qty_style: data.minQtyStyle,
      purchase_price: data.purchasePrice,
      forecast_amount: data.forecastAmount,
    })),
    meta: { totalRowCount: itemColorDataCount.unwrap() },
  };
};
