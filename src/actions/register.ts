'use server';

import { FormState, SignupFormSchema } from "@/lib/definitions";

export default async function register(formData: FormData): Promise<FormState> {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
}
