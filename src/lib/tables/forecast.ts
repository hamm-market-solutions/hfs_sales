import {
    getForecastTableData,
    getForecastTableCount,
} from "../models/itemColor";

import { phaseToDrop, seasonToShort } from "@/utils/conversions";
import {
    ForecastTableColumns,
    ForecastTableRequest,
    TableResponse,
} from "@/types/table";
import { buildTableUrl } from "@/utils/tables";
import { Option } from "fp-ts/Option";
import { None, Some, unwrap, unwrapOr } from "@/utils/fp-ts";

export const getForecastTableDataMapper = async ({
    page,
    sorting,
    country,
    brand,
    season_code,
    search,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableColumns>> => {
    const itemColorData = await getForecastTableData({
        page,
        sorting,
        country,
        brand,
        season_code,
        search,
    });
    const itemColorDataCount = unwrap((await getForecastTableCount({
        brand,
        season_code,
    })));

    const [nextUrl, previousUrl] = buildTableUrl<ForecastTableColumns, ForecastTableRequest>(itemColorDataCount, "/api/sales/reports/forecasts/table", {
        page,
        sorting,
        search,
        country,
        brand,
        season_code,
    });


    return {
        data: unwrap(itemColorData).map((data) => {
            const last = data.last ? Some(data.last) : None;
            const itemNo = data.itemNo;
            const colorCode = data.colorCode;
            const brandNo = data.brandNo ? Some(data.brandNo) : None;
            const brandName = data.brandName ? Some(data.brandName) : None;
            const seasonCode = data.seasonCode ? Some(data.seasonCode) : None;
            const seasonName = data.seasonName ? Some(data.seasonName) : None;
            const preCollection = data.preCollection;
            const mainCollection = data.mainCollection;
            const lateCollection = data.lateCollection;
            const specialCollection = data.specialCollection;
            const description = data.description ? Some(data.description) : None;
            const rrp = data.rrp;
            const wsp = data.wsp;
            const forecastAmount = data.forecastAmount;

            return {
                img_src: [last, Some(itemNo), Some(colorCode)] as [Option<string>, Option<string>, Option<string>],
                brand_no: brandNo,
                brand_name: brandName,
                season_code: seasonCode,
                season_name: seasonToShort(unwrapOr(seasonName, "")),
                pre_collection: preCollection,
                main_collection: mainCollection,
                late_collection: lateCollection,
                special_collection: specialCollection,
                drop: phaseToDrop({
                    pre_collection: preCollection,
                    main_collection: mainCollection,
                    late_collection: lateCollection,
                    Special_collection: specialCollection,
                }),
                item_no: Some(itemNo),
                description: description,
                color_code: colorCode,
                rrp: Some(rrp),
                wsp: Some(wsp),
                forecast_amount: Some(forecastAmount),
            }
        }),
        meta: {
            totalRowCount: itemColorDataCount,
            next: unwrapOr(nextUrl, undefined),
            previous: unwrapOr(previousUrl, undefined),
        },
    };
};
