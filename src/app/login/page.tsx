"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React from "react";

import { LoginFormSchema } from "@/lib/schemas";
import { HfsErrResponse } from "@/types/responses";
import { handleLogin } from "@/actions/auth/login";
import { routes } from "@/config/routes";

export default function Login() {
  const [emailError, setEmailError] = React.useState<string | null>(null);
  // const [passwordError, setPasswordError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError(null);
    // setPasswordError(null);
    const formData = new FormData(event.currentTarget);
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get("email"),
      // password: formData.get("password"),
    });
    let errors = validatedFields.error?.flatten().fieldErrors;

    if (errors?.email) {
      setEmailError(errors.email[0]);
    }
    // if (errors?.password) {
    //   setPasswordError(errors.password[0]);
    // }
    if (errors) return;

    const response = await handleLogin(
      formData.get("email") as string,
      formData.get("password") as string,
    );

    if (response.err) {
      const errors: HfsErrResponse<{ email?: string; password?: string }> =
        response.val;

      if (errors?.errors.email) {
        setEmailError(errors.errors.email[0]);
      }
      // if (errors?.errors.password) {
      //   setPasswordError(errors.errors.password[0]);
      // }
    }
    document.location.href = routes.dashboard;
  }

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <Input
          errorMessage={emailError}
          isInvalid={emailError ? true : false}
          label="Email"
          name="email"
          type="email"
          variant="bordered"
        />
        <Input
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
