"use client";

import { Input, InputProps } from "@nextui-org/input";
import { useState } from "react";
import clsx from "clsx";

import HfsError from "@/lib/errors/HfsError";

export default function EditableCell<T extends object>({
    index,
    editableIndex,
    tableRow,
    initValue,
    setEditableIndex,
    submitFn,
    ...props
}: {
  index: number;
  editableIndex: number;
  tableRow: T;
  initValue?: string;
  onBlurFocusNext?: boolean;
  setEditableIndex: (index: number) => void;
  submitFn: (row: T, value: unknown) => Promise<HfsError | void>;
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
                        console.log("new value", value);

                        setValue(value);
                    }
                }}
                onChange={(e) => {
                    const val = e.target.value;
                    console.log("changed value", val);

                    setValue(val);
                }}
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
                            console.log("value", value);
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
