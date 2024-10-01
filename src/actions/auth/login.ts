"use server";

import { LoginFormSchema } from "@/lib/schemas";
import { LoginResponse } from "@/types/response";

export async function login(formData: FormData): Promise<LoginResponse> {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: 400,
      errors: validatedFields.error?.flatten().fieldErrors,
    };
  }

  return { status: 200 };
}
