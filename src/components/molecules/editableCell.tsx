"use client";

import { Input, InputProps } from "@nextui-org/input";
import { useState } from "react";
import clsx from "clsx";

import HfsError from "@/lib/errors/HfsError";

export default function EditableCell<T extends object>({
  index,
  editableIndex,
  setEditableIndex,
  tableRow,
  submitFn,
  initValue,
  onBlurFocusNext,
  ...props
}: {
  index: number;
  editableIndex: number;
  setEditableIndex: (index: number) => void;
  tableRow: T;
  submitFn: (row: T, value: any) => Promise<HfsError | void>;
  initValue?: string;
  onBlurFocusNext?: boolean;
} & InputProps) {
  const [value, setValue] = useState<
    string | (readonly string[] & string) | undefined
  >(initValue);
  const [error, setError] = useState<HfsError | null>(null);
  const isEditable = index === editableIndex;

  if (isEditable) {
    return (
      <Input
        autoFocus
        className="editable-cell editable-cell_active"
        value={value}
        onBlur={async () => {
          setEditableIndex(-1);
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
          } else {
            setValue(value);
          }
        }}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={async(e) => {
          if (["Enter", "Tab"].includes(e.key)) {
            e.preventDefault();
            setEditableIndex(index += 1)
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
            } else {
              setValue(value);
            }
          }
        }}
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
        onClick={() => {
          setEditableIndex(index);
        }}
      >
        {error ? (
          <span className="editable-cell editable-cell_inactive text-[10px] text-red-500">{error.error}</span>
        ) : (
          <span className="editable-cell editable-cell_inactive text-tertiary underline">{value ?? initValue}</span>
        )}
      </div>
    );
  }
}
