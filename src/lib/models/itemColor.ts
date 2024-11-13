import { Err, Ok } from "ts-results";
import { and, count, eq } from "drizzle-orm";

import HfsError from "../errors/HfsError";
import ItemColorModelError from "../errors/ItemColorModelError";
import { getAccessTokenPayload } from "../auth/jwt";

import { ForecastTableRequest } from "@/types/table";
import { sortingStateToPrisma } from "@/utils/conversions";
import { deepCopy } from "@/utils/objects";
import { db } from "@/db";
import { sItem, sItemColor } from "@/db/schema";

export const getForecastItemColorDataCount = async ({
  country,
  brand,
  season_code,
}: {
  country: string;
  brand: number;
  season_code: number;
}) => {
  try {
    const dataCount = await db
    .select({ count: count() })
    .from(sItemColor)
    .leftJoin(
      sItem,
      and(
        eq(sItemColor.itemNo, sItem.no),
      ),
    ).where(and(
      eq(sItem.brandNo, brand.toString()),
      eq(sItem.seasonCode, season_code),
    ));

    return Ok(
      dataCount[0].count,
    );
  } catch (error) {
    return Err(
      HfsError.fromThrow(
        500,
        ItemColorModelError.getForecastDataCountError(),
        error as Error,
      ),
    );
  }
};

export const getForecastItemColorData = async ({
  start,
  size,
  sorting,
  country,
  brand,
  season_code,
}: ForecastTableRequest) => {
  try {
    // const select = {
    //   s_item: {
    //     select: {
    //       brand_no: true,
    //       season_code: true,
    //       description: true,
    //       min_qty_style: true,
    //     },
    //   },
    //   pre_collection: true,
    //   main_collection: true,
    //   late_collection: true,
    //   Special_collection: true,
    //   item_no: true,
    //   color_code: true,
    //   purchase_price: true,
    // };
    // const selectClone = deepCopy(select);
    // const orderBy = sortingStateToPrisma(selectClone, sorting);
    const userId = (await getAccessTokenPayload()).unwrap().sub!;
    // const raw = `
    //   SELECT
    //     si.brand_no,
    //     si.season_code,
    //     si.description,
    //     si.min_qty_style,
    //     sic.item_no,
    //     sic.color_code,
    //     sic.purchase_price,
    //     sic.pre_collection,
    //     sic.main_collection,
    //     sic.late_collection,
    //     sic.Special_collection,
    //     f.amount
    //   FROM s_item_color sic
    //   LEFT JOIN s_item si ON sic.item_no = si.item_no
    //   LEFT JOIN forecast f ON sic.item_no = f.item_no AND sic.color_code = f.color_code AND f.country_code = ${country} AND f.created_by = ${userId}
    //   WHERE si.brand_no = ${brand}
    //   AND si.season_code = ${season_code}
    //   ORDER BY ${orderBy}
    //   LIMIT ${size}
    //   OFFSET ${start}
    // `;

    return Ok(
      //   await prisma.s_item_color.findMany({
      //     select: select,
      //     where: {
      //       s_item: {
      //         brand_no: brand.toString(),
      //         season_code: season_code,
      //       },
      //     },
      //     orderBy: orderBy,
      //     skip: start,
      //     take: size,
      //   }),
      await db
        .select({
          brandNo: sItem.brandNo,
          seasonCode: sItem.seasonCode,
          description: sItem.description,
          minQtyStyle: sItem.minQtyStyle,
          preCollection: sItemColor.preCollection,
          mainCollection: sItemColor.mainCollection,
          lateCollection:  sItemColor.lateCollection,
          SpecialCollection: sItemColor.specialCollection,
          itemNo: sItemColor.itemNo,
          colorCode: sItemColor.colorCode,
          purchasePrice: sItemColor.purchasePrice,
        })
        .from(sItemColor)
        .leftJoin(
          sItem,
          and(
            eq(sItemColor.itemNo, sItem.no),
          ),
        )
        // .orderBy({
        //   [orderBy]: "asc",
        // })
        .limit(size)
        .offset(start),
    );
  } catch (error) {
    console.log(error);

    return Err(
      HfsError.fromThrow(
        500,
        ItemColorModelError.getForecastDataError(),
        error as Error,
      ),
    );
  }
};
