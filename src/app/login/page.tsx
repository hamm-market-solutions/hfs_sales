"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React from "react";
import Form from "next/form";

import Title from "@/components/molecules/title";
import { routes } from "@/config/routes";

export default function Login() {
  const handleSubmit = async (data: FormData) => {
    const res = await fetch(routes.api.auth.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    })
  };

  return (
    <div className="login-page">
      <Title title="Login" />
      <Form action={handleSubmit} className="flex flex-col gap-2">
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
        {/* {isPending && <p>Loading...</p>}
        {error && !isPending && (
          <p className="text-red">{error.message.replaceAll('"', "")}</p>
        )} */}
      </Form>
    </div>
  );
}
