"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React from "react";
import axios, { AxiosError } from "axios";

import { LoginFormSchema } from "@/lib/schemas";
import { routes } from "@/config/routes";
import { LoginRequest } from "@/types/auth";
import { HfsErrResponse } from "@/types/responses";

export default function Login() {
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    const formData = new FormData(event.currentTarget);
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    let errors = validatedFields.error?.flatten().fieldErrors;

    if (errors?.email) {
      setEmailError(errors.email[0]);
    }
    if (errors?.password) {
      setPasswordError(errors.password[0]);
    }
    if (errors) return;

    let request: LoginRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    axios
      .post(routes.api.login, request, {
        headers: { "Content-Type": "application/json" },
      })
      .then((_) => {
        document.location.href = "/";
      })
      .catch(
        (
          err: AxiosError<
            HfsErrResponse<{ email?: string; password?: string }>
          >,
        ) => {
          const errors = err.response?.data.errors;

          if (errors?.email) {
            setEmailError(errors.email[0]);
          }
          if (errors?.password) {
            setPasswordError(errors.password[0]);
          }
        },
      );
  }

  return (
    <section>
      <h2 className="text-xl mb-2">Login</h2>
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
          errorMessage={passwordError}
          isInvalid={passwordError ? true : false}
          label="Password"
          name="password"
          type="password"
          variant="bordered"
        />
        <Button type="submit">Submit</Button>
      </form>
    </section>
  );
}
