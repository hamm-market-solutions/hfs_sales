import { NextResponse } from "next/server";
import { SafeParseReturnType } from "zod";
import { Err, None, Ok, Option, Some } from "ts-results";
import { MySqlColumn } from "drizzle-orm/mysql-core";
import { asc, desc, SQL } from "drizzle-orm";
import { NextApiResponse } from "next";

import { HfsResult } from "../lib/errors/HfsError";
import { HfsResponse } from "../types/responses";
import { TableSort } from "@/types/table";

export function resultToResponse<T extends object, R = HfsResponse<T>>(
    result: HfsResult<T>,
    response: Option<NextApiResponse<R>> = None,
): NextResponse<R> {
    if (response.some) {
        response.val.status(result.ok ? 200 : result.val.status);
    }
    if (result.ok) {
        return NextResponse.json({
            status: 200,
            data: result.val,
        }) as NextResponse<R>;
    } else {
        return NextResponse.json(
            { ...result.val },
            { status: result.val.status },
        ) as NextResponse<R>;
    }
}

export function schemaToResult<Output, Input = Output>(
    schema: SafeParseReturnType<Input, Output>,
): HfsResult<Output> {
    if (!schema.success) {
        return Err({ status: 400, message: schema.error?.errors[0].message, cause: None });
    }

    return Ok(schema.data!);
}

export function optionToNotFound<T>(
    option: Option<T>,
    errorMessage = "resource not found",
): HfsResult<T> {
    if (option.none || option.val === null || option.val === undefined) {
        return Err({ status: 404, message: errorMessage, cause: None });
    }

    return Ok(option.val);
}

export const sortingStateToDrizzle = <T extends object>(
    drizzleSelect: { [key: string]: MySqlColumn | SQL },
    sort: TableSort<T>,
) => {
    const sortings = [];

    console.log("ERVER", sort);

    if (sort.direction == "descending") {
        sortings.push(desc(drizzleSelect[snakeCaseToCamelCase(sort.column as string)]));
    } else {
        sortings.push(asc(drizzleSelect[snakeCaseToCamelCase(sort.column as string)]));
    }

    return sortings;
    // let flattenedSorting: { [key: string]: string } = {};

    // for (const sort of sorting) {
    //   flattenedSorting = {
    //     ...flattenedSorting,
    //     [sort.id]: sort.desc ? "desc" : "asc",
    //   };
    // }
    // for (const key in prismaSelect) {
    //   if (typeof prismaSelect[key] === "object") {
    //     prismaSelect[key] = sortingStateToDrizzle(
    //       prismaSelect[key]["select"],
    //       sorting,
    //     );
    //     if (Object.keys(prismaSelect[key]).length === 0) {
    //       delete prismaSelect[key];
    //     }
    //   } else {
    //     if (flattenedSorting[key]) {
    //       prismaSelect[key] = flattenedSorting[key];
    //     } else {
    //       delete prismaSelect[key];
    //     }
    //   }
    // }

    // return prismaSelect;
};

export const phaseToDrop = ({
    pre_collection,
    main_collection,
    late_collection,
    Special_collection,
}: {
  pre_collection: number;
  main_collection: number;
  late_collection: number;
  Special_collection: number;
}) => {
    if (pre_collection !== 0) {
        return 1;
    } else if (main_collection !== 0) {
        return 2;
    } else if (late_collection !== 0) {
        return 3;
    } else if (Special_collection !== 0) {
        return 4;
    }

    return 0;
};

export const snakeCaseToCamelCase = (str: string) => {
    return str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
};

export const camelCaseToSnakeCase = (str: string) => {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Converts any case string to camel case, including:
 * - snake_case
 * - kebab-case
 * - PascalCase
 * - camelCase
 * - Title Case
 */
export const toCamelCase = (input: string) => {
    // Normalize input to lowercase and split by non-alphanumeric characters or boundaries.
    const words = input
        .trim()
        .replace(/[-_\s]+/g, ' ') // Replace separators (hyphen, underscore, space) with a single space.
        .split(/\s+/); // Split by spaces (words are separated by spaces).

    // Convert the first word to lowercase and subsequent words to title case.
    return words
        .map((word, index) => {
            if (index === 0) return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
};

export const seasonToShort = (season: string): Option<string> => {
    if (!season) {
        return None;
    }

    const [firstSeason, secondSeasonAndYear] = season?.split("/") ?? [];
    const [secondSeason, year] = secondSeasonAndYear.split(" ") ?? [];
    const firstLetterFirstSeason = firstSeason?.charAt(0).toUpperCase();
    const firstLetterSecondSeason = secondSeason?.charAt(0).toUpperCase();

    return Some(`${firstLetterFirstSeason}/${firstLetterSecondSeason} ${year}`);
};
