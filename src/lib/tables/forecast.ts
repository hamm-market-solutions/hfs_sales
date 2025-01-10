import {
    getForecastTableData,
    getForecastTableCount,
} from "../models/itemColor";

import { seasonToShort } from "@/utils/conversions";
import {
    ForecastTableColumns,
    ForecastTableRequest,
    TableResponse,
} from "@/types/table";

export const getForecastTableDataMapper = async ({
    sorting,
    country,
    brand,
    season_code,
    search,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableColumns>> => {
    const itemColorData = await getForecastTableData({
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
            img_src: [data.last ?? undefined, data.itemNo.toString(), data.colorCode],
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
            rrp: data.rrp,
            wsp: data.wsp,
            forecast_amount: data.forecastAmount,
        })),
        meta: { totalRowCount: itemColorDataCount.unwrap() },
    };
};
