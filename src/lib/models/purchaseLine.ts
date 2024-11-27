import { db } from "@/db"
import { sPurchaseHead, sPurchaseLine } from "@/db/schema"
import { eq, sum } from "drizzle-orm"
import { Err, Ok } from "ts-results"
import HfsError from "../errors/HfsError"
import PurchaseHeadModelError from "../errors/PurchaseHeadModelError"

export const getQtyPairSumPerSeason = async (seasonCode: number) => {
    try {
        const res = await db
            .select({ qtyPairSum: sum(sPurchaseLine.qtyPair) })
            .from(sPurchaseHead)
            .leftJoin(sPurchaseLine, eq(sPurchaseHead.orderNo, sPurchaseLine.orderNo))
            .where(eq(sPurchaseHead.seasonCode, seasonCode));

        return Ok(res[0])
    } catch (error) {
        return Err(HfsError.fromThrow(500, PurchaseHeadModelError.sumError(`qty. pair for season ${seasonCode}`), error as Error))
    }
}
