"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validateLoginForm } from "@/lib/schemas/login";
import {
    getUserByEmail,
    updateAccessToken,
    verifyPassword,
} from "@/lib/models/user";

export async function handleLogin(form: FormData): Promise<void> {
    const formValidationRes = validateLoginForm(form);

    if (formValidationRes.err) {
        return;
        // return formValidationRes.val;
    }
    const email = formValidationRes.val.email;
    const password = formValidationRes.val.password;
    const userRes = await getUserByEmail(email);

    if (userRes.err) {
        return;
        // return userRes.val;
    }
    const passwordVerifyRes = await verifyPassword(userRes.val.id, password);

    if (passwordVerifyRes.err) {
        return;
        // return passwordVerifyRes.val;
    }
    const accessTokenRes = await updateAccessToken(userRes.val.id);

    if (accessTokenRes.err) {
        return;
        // return accessTokenRes.val;
    }
    (await cookies()).set("refreshToken", accessTokenRes.val.refreshToken[0], {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: accessTokenRes.val.refreshToken[1].exp! * 1000,
    });

    redirect("/dashboard");
}
