"use client";

import { Input, InputProps } from "@nextui-org/input";
import { useState } from "react";
import clsx from "clsx";

import { HfsErrResponse, HfsResponse } from "@/types/responses";
import Icon from "../atoms/icons/icon";

export default function EditableCell<T extends object>({
  tableRow,
  submitFn,
  initValue,
  ...props
}: {
  tableRow: T;
  submitFn: (row: T, value: any) => Promise<HfsResponse>;
  initValue?: string;
} & InputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<
    string | (readonly string[] & string) | undefined
  >(initValue);
  const [error, setError] = useState<string | undefined>(undefined);

  // Toggle between edit and view mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        errorMessage={error}
        isInvalid={error !== undefined}
        value={value}
        onBlur={async () => {
          setIsEditing(false);
          if (
            value == "" ||
            value == undefined ||
            value == null ||
            value == initValue
          ) {
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
  } else {
    return (
      <div
        className={clsx("cursor-pointer place-content-center", props.className)}
        onClick={toggleEdit}
      >
        <span className="text-tertiary underline">{value ?? initValue}</span>
      </div>
    );
  }
}
