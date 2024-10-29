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
  const getDrop = (data: {
    pre_collection: number;
    main_collection: number;
    late_collection: number;
    Special_collection: number;
  }) => {
    console.log(data);

    if (data.pre_collection !== 0) {
      return "1";
    } else if (data.main_collection !== 0) {
      return "2";
    } else if (data.late_collection !== 0) {
      return "3";
    } else if (data.Special_collection !== 0) {
      return "4";
    }

    return "";
  };

  return {
    data: itemColorData.unwrap().map((data) => ({
      img_src: "/assets/img-placeholder.svg",
      brand: data.s_item.brand_no,
      season_code: data.s_item.season_code,
      drop: getDrop(data),
      item_no: data.item_no,
      description: data.s_item.description,
      item_color: data.color_code,
      min_qty_per_order: data.s_item.min_qty_style,
      price: data.purchase_price,
    })),
    meta: { totalRowCount: itemColorData.unwrap().length },
  };
};
