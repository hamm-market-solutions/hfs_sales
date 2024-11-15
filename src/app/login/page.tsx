"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useActionState } from "react";
import Form from "next/form";

import { handleLogin } from "@/actions/auth/login";
import Title from "@/components/molecules/title";

export default function Login() {
  const [error, formAction, isPending] = useActionState(
    handleLogin,
    null,
  );

  return (
    <div className="login-page">
      <Title title="Login" />
      <Form action={formAction} className="flex flex-col gap-2">
        <Input
          isRequired
          // errorMessage={
          //   !isPending && message?.err
          //     ? (message.val as LoginErrResponse).error
          //     : ""
          // }
          // isInvalid={!isPending && message?.err}
          label="Email"
          name="email"
          type="email"
          variant="bordered"
        />
        <Input
          isRequired
          // errorMessage={
          //   !isPending && message?.err
          //     ? (message.val as LoginErrResponse).error
          //     : ""
          // }
          // isInvalid={!isPending && message?.err}
          label="Password"
          name="password"
          type="password"
          variant="bordered"
        />
        <Button className="bg-secondary text-white" type="submit">
          Submit
        </Button>
        {isPending && <p>Loading...</p>}
        {(error && !isPending) && <p className="text-red">{error.message.replaceAll("\"", "")}</p>}
      </Form>
    </div>
  );
}
