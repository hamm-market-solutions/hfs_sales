"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useActionState } from "react";

import { handleLogin } from "@/actions/auth/login";
import Title from "@/components/molecules/title";
import { LoginErrResponse } from "@/types/responses";

export default function Login() {
  const [message, formAction, isPending] = useActionState(
    handleLogin,
    undefined,
  );

  return (
    <div className="login-page">
      <Title title="Login" />
      <form action={formAction} className="flex flex-col gap-2">
        <Input
          isRequired
          errorMessage={
            !isPending && message?.err
              ? (message.val as LoginErrResponse).errors.email
              : ""
          }
          isInvalid={!isPending && message?.err}
          label="Email"
          name="email"
          type="email"
          variant="bordered"
        />
        <Input
          isRequired
          errorMessage={
            !isPending && message?.err
              ? (message.val as LoginErrResponse).errors.password
              : ""
          }
          isInvalid={!isPending && message?.err}
          label="Password"
          name="password"
          type="password"
          variant="bordered"
        />
        <Button className="bg-secondary" type="submit">
          Submit
        </Button>
        {isPending ? <p>Loading...</p> : message}
      </form>
    </div>
  );
}
