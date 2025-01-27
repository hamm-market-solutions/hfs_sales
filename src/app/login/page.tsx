"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import React, { useActionState } from "react";
import Form from "next/form";

import Title from "@/components/molecules/title";
import { handleLogin } from "@/actions/auth/login";
import { None, unwrapOr } from "@/utils/fp-ts";

export default function Login() {
    const [error, setError, isPending] = useActionState(handleLogin, None);

    return (
        <div className="login-page">
            <Title subtitle={None} title="Login" />
            <Form action={setError} className="flex flex-col gap-2">
                <Input
                    isRequired
                    label="Email"
                    name="email"
                    type="email"
                    variant="bordered"
                />
                <Input
                    isRequired
                    label="Password"
                    name="password"
                    type="password"
                    variant="bordered"
                />
                <Button className="bg-secondary text-white" type="submit">
                    Submit
                </Button>
                {isPending && <p>Loading...</p>}
                {error && !isPending && (
                    <p className="text-red">{unwrapOr(error, { status: 500, message: "", cause: None }).message}</p>
                )}
            </Form>
        </div>
    );
}
