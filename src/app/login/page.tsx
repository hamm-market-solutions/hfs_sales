"use client";

import login from "@/actions/login";
import { FormEvent } from "react";

export default function Login() {
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);
        const user: string = formdata.get("user") as string ?? "";
        const password: string = formdata.get("password") as string ?? "";

        await login(user, password);
    }

    return <>
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-1">
            <input type="text" name="user" id="user" />
            <input type="password" name="password" id="password" />
        </form>
    </>;
}
