"use client";

import { Input, InputProps } from "@nextui-org/input";
import { useState } from "react";

import { HfsErrResponse, HfsResponse } from "@/types/responses";

export default function TableInput<T extends object>({
  tableRow,
  submitFn,
  initValue,
  ...props
}: {
  tableRow: T;
  submitFn: (row: T, value: any) => Promise<HfsResponse>;
  initValue?: string;
} & InputProps) {
  const [value, setValue] = useState<
    string | (readonly string[] & string) | undefined
  >(initValue);
  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <Input
      errorMessage={error}
      isInvalid={error !== undefined}
      value={value}
      onBlur={async () => {
        if (value == "" || value == undefined || value == null || value == initValue) {
          return;
        }
        const response = await submitFn(tableRow, value);

        console.log(response);

        if (response.status !== 200) {
          setError((response as HfsErrResponse).error);
        }
      }}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
}
