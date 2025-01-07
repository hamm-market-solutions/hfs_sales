import { z } from "zod";

import { HfsResult } from "../errors/HfsError";

import { schemaToResult } from "@/utils/conversions";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z.string().trim().min(1, { message: "Please enter a password." }),
});

export const validateLoginForm = (
    data: FormData,
): HfsResult<LoginFormValues> => {
    return schemaToResult(
        LoginFormSchema.safeParse({
            email: data.get("email"),
            password: data.get("password"),
        }),
    );
};
