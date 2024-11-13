import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useActionState } from "react";

import { handleLogin } from "@/actions/auth/login";
import Title from "@/components/molecules/title";
import { LoginErrResponse } from "@/types/responses";

export default function Login() {
  // const [message, formAction, isPending] = useActionState(
  //   handleLogin,
  //   undefined,
  // );
  const submitLoginData = async (formData: FormData) => {
    "use server";

    handleLogin(formData);
  }

  return (
    <div className="login-page">
      <Title title="Login" />
      <form action={submitLoginData} className="flex flex-col gap-2">
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
        <Button className="bg-secondary" type="submit">
          Submit
        </Button>
        {/* {isPending ? <p>Loading...</p> : message} */}
      </form>
    </div>
  );
}
