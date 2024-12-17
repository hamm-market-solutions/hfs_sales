import {
  getForecastTableData,
  getForecastTableCount,
} from "../models/itemColor";

import { seasonToShort } from "@/utils/conversions";
import {
  ForecastTableData,
  ForecastTableRequest,
  TableResponse,
} from "@/types/table";

export const getForecastTableDataMapper = async ({
  start,
  size,
  sorting,
  country,
  brand,
  season_code,
  search,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableData>> => {
  const itemColorData = await getForecastTableData({
    start,
    size,
    sorting,
    country,
    brand,
    season_code,
    search,
  });

  const itemColorDataCount = await getForecastTableCount({
    brand,
    season_code,
  });

  return {
    data: itemColorData.unwrap().map((data) => ({
      imgSrc: [data.last ?? undefined, data.itemNo.toString(), data.colorCode],
      brand_no: data.brandNo,
      brand_name: data.brandName,
      season_code: data.seasonCode,
      season_name: seasonToShort(data.seasonName ?? ""),
      pre_collection: data.preCollection,
      main_collection: data.mainCollection,
      late_collection: data.lateCollection,
      Special_collection: data.specialCollection,
      item_no: data.itemNo,
      description: data.description,
      color_code: data.colorCode,
      sale_price: data.salePrice,
      forecast_amount: data.forecastAmount,
    })),
    meta: { totalRowCount: itemColorDataCount.unwrap() },
  };
};
