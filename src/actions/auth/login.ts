"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validateLoginForm } from "@/lib/schemas/login";
import {
    getUserByEmail,
    updateAccessToken,
    verifyPassword,
} from "@/lib/models/user";
import { HfsError } from "@/lib/errors/HfsError";

export async function handleLogin(prevState: HfsError, formData: FormData): Promise<HfsError> {
    const formValidationRes = validateLoginForm(formData);

    if (formValidationRes.err) {
        return formValidationRes.val;
    }
    const email = formValidationRes.val.email;
    const password = formValidationRes.val.password;
    const userRes = await getUserByEmail(email);

    if (userRes.err) {
        return userRes.val;
    }
    const passwordVerifyRes = await verifyPassword(userRes.val.id, password);

    if (passwordVerifyRes.err) {
        return passwordVerifyRes.val;
    }
    const accessTokenRes = await updateAccessToken(userRes.val.id);

    if (accessTokenRes.err) {
        return accessTokenRes.val;
    }
    (await cookies()).set("refreshToken", accessTokenRes.val.refreshToken[0], {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: accessTokenRes.val.refreshToken[1].exp! * 1000,
    });

    redirect("/dashboard");
}
