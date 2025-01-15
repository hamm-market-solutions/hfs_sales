import { phaseToDrop, seasonToShort } from "@/utils/conversions";
import {
    ForecastTableColumns,
    ForecastTableRequest,
    TableResponse,
} from "@/types/table";
import { buildTableUrl } from "@/utils/tables";
import { Option } from "fp-ts/Option";
import { None, Some, unwrap, unwrapOr } from "@/utils/fp-ts";
import { getForecastTableData } from "../models/forecast";

export const getForecastTableDataMapper = async ({
    page,
    sorting,
    country,
    brand,
    season_code,
    filters,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableColumns>> => {
    const forecastData = unwrap(await getForecastTableData({
        page,
        sorting,
        country,
        brand,
        season_code,
        filters,
    }));
    const forecastDataCount = forecastData[0].totalRowCount ?? 0;

    const [nextUrl, previousUrl] = buildTableUrl<ForecastTableColumns, ForecastTableRequest>(forecastDataCount, "/api/sales/reports/forecasts/table", {
        page,
        sorting,
        filters,
        country,
        brand,
        season_code,
    });


    return {
        data: forecastData.map((data) => {
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
            totalRowCount: forecastDataCount,
            next: unwrapOr(nextUrl, undefined),
            previous: unwrapOr(previousUrl, undefined),
        },
    };
};
