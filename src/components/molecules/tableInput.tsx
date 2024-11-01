"use client";

import { HfsErrResponse, HfsResponse } from "@/types/responses";
import { Input, InputProps } from "@nextui-org/input";
import { useState } from "react";

export default function TableInput<T extends object>({
  tableRow,
  submitFn,
  ...props
}: { tableRow: T; submitFn: (row: T, value: any) => Promise<HfsResponse> } & InputProps) {
  const [value, setValue] = useState<
    string | (readonly string[] & string) | undefined
  >("");
  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <Input
      value={value}
      onBlur={async () => {
        if (value == "") {
          return;
        }
        const response = await submitFn(tableRow, value);
        console.log(response);

        if (response.status !== 200) {
          setError((response as HfsErrResponse).error);
        }
      }}
      onChange={(e) => setValue(e.target.value)}
      errorMessage={error}
      isInvalid={error !== undefined}
      {...props}
    />
  );
}
