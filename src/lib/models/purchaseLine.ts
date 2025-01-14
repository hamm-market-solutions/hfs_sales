import { db } from "@/db"
import { sPurchaseHead, sPurchaseLine } from "@/db/schema"
import { eq, sum } from "drizzle-orm"
import PurchaseHeadModelError from "../errors/PurchaseHeadModelError"
import { throwToHfsError } from "../errors/HfsError"
import { Err, Ok, Some } from "@/utils/fp-ts"

export const getQtyPairSumPerSeason = async (seasonCode: number) => {
    try {
        const res = await db
            .select({ qtyPairSum: sum(sPurchaseLine.qtyPair) })
            .from(sPurchaseHead)
            .leftJoin(sPurchaseLine, eq(sPurchaseHead.orderNo, sPurchaseLine.orderNo))
            .where(eq(sPurchaseHead.seasonCode, seasonCode));

        return Ok(res[0])
    } catch (error) {
        return Err(throwToHfsError(500, PurchaseHeadModelError.sumError(`qty. pair for season ${seasonCode}`), Some(error as Error)))
    }
}
