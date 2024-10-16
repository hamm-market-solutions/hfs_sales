"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React from "react";

import { handleLogin } from "@/actions/auth/login";
import Title from "@/components/molecules/title";
// import { LoginErrResponse } from "@/types/responses";

export default function Login() {
  // const [emailError, setEmailError] = React.useState<string | null>(null);
  // const [passwordError, setPasswordError] = React.useState<string | null>(null);

  // async function login(form: FormData) {
  //   const response = await handleLogin(form);
  //   console.log(response);

  //   if (response.err) {
  //     const res = response.val as LoginErrResponse;

  //     if (res.errors.email) {
  //       setEmailError(res.errors.email[0]);
  //     } else {
  //       setEmailError(null);
  //     }
  //     if (res.errors.password) {
  //       setPasswordError(res.errors.password[0]);
  //     } else {
  //       setPasswordError(null);
  //     }
  //   }
  // }

  return (
    <div className="login-page">
      <Title title="Login" />
      <form action={handleLogin} className="flex flex-col gap-2">
        <Input
          required
          // errorMessage={emailError}
          // isInvalid={emailError ? true : false}
          label="Email"
          name="email"
          type="email"
          variant="bordered"
        />
        <Input
          required
          // errorMessage={passwordError}
          // isInvalid={passwordError ? true : false}
          label="Password"
          name="password"
          type="password"
          variant="bordered"
        />
        <Button className="bg-secondary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
