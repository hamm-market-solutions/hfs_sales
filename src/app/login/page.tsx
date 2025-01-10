"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useActionState } from "react";
import Form from "next/form";

import Title from "@/components/molecules/title";
import { handleLogin } from "@/actions/auth/login";

export default function Login() {
    const [error, setError, isPending] = useActionState(handleLogin, null);

    return (
        <div className="login-page">
            <Title title="Login" />
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
                    <p className="text-red">{error.message}</p>
                )}
            </Form>
        </div>
    );
}
