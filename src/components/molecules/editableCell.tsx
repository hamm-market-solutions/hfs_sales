"use client";

import { Input, InputProps } from "@nextui-org/input";
import { useState } from "react";
import clsx from "clsx";

import HfsError from "@/lib/errors/HfsError";

export default function EditableCell<T extends object>({
  tableRow,
  submitFn,
  initValue,
  ...props
}: {
  tableRow: T;
  submitFn: (row: T, value: any) => Promise<HfsError | void>;
  initValue?: string;
} & InputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<
    string | (readonly string[] & string) | undefined
  >(initValue);
  const [error, setError] = useState<HfsError | null>(null);

  console.log(error);

  // Toggle between edit and view mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={value}
        onBlur={async () => {
          setIsEditing(false);
          setError(null);
          if (
            value == "" ||
            value == undefined ||
            value == null ||
            value == initValue
          ) {
            return;
          }
          const error = await submitFn(tableRow, value);

          if (error) {
            setError(error);
          }
        }}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    );
  } else {
    return (
      <div
        className={clsx(
          "flex flex-col cursor-pointer place-content-center",
          props.className,
        )}
        onClick={toggleEdit}
      >
        {error ? (
          <span className="text-[10px] text-red-500">{error.error}</span>
        ) : (
          <span className="text-tertiary underline">{value ?? initValue}</span>
        )}
      </div>
    );
  }
}
