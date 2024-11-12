// "use server";

// import { Err, Ok } from "ts-results";

// import prisma from "../prisma";
// import HfsError from "../errors/HfsError";
// import BrandModelError from "../errors/BrandModelError";

// export const getAllBrands = async () => {
//   try {
//     return Ok(
//       await prisma.brand.findMany({
//         orderBy: {
//           name: "asc",
//         },
//       }),
//     );
//   } catch (error) {
//     return Err(
//       HfsError.fromThrow(500, BrandModelError.getError(), error as Error),
//     );
//   }
// };
