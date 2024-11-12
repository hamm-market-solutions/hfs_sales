// import { Err, Ok } from "ts-results";
// import { forecast } from "@prisma/client";

// import prisma from "../prisma";
// import HfsError, { HfsResult } from "../errors/HfsError";
// import ForecastModelError from "../errors/ForecastModelError";
// import { getAccessTokenPayload } from "../auth/jwt";

// export const createForecast = async (
//   itemNo: number,
//   colorCode: string,
//   countryCode: string,
//   amount: number,
// ) => {
//   try {
//     const latestForecast = (
//       await getLatestForecast(itemNo, colorCode)
//     ).unwrapOr(null);

//     if (latestForecast && latestForecast.amount === amount) {
//       return Ok(latestForecast);
//     }
//     const user = await getAccessTokenPayload();

//     if (user.err) {
//       return user;
//     }
//     const userId = user.val.sub!;
//     const newForecast = await prisma.forecast.create({
//       data: {
//         item_no: itemNo.toString(),
//         color_code: colorCode,
//         amount: amount,
//         country_code: countryCode.toUpperCase(),
//         created_by: Number(userId),
//       },
//     });

//     return Ok(newForecast);
//   } catch (error) {
//     return Err(
//       HfsError.fromThrow(
//         500,
//         ForecastModelError.saveForecastError(),
//         error as Error,
//       ),
//     );
//   }
// };

// export async function getLatestForecast(
//   itemNo: number,
//   colorCode: string,
// ): Promise<HfsResult<forecast | null>> {
//   try {
//     return Ok(
//       await prisma.forecast.findFirst({
//         where: {
//           item_no: itemNo.toString(),
//           color_code: colorCode,
//         },
//         orderBy: {
//           timestamp: "desc",
//         },
//       }),
//     );
//   } catch (error) {
//     console.error(error);

//     return Err(
//       HfsError.fromThrow(
//         500,
//         ForecastModelError.getError("latest forecast"),
//         error as Error,
//       ),
//     );
//   }
// }
