"use client";

import { Input, InputProps } from "@nextui-org/input";
import { useState } from "react";
import clsx from "clsx";
import { HfsError } from "@/lib/errors/HfsError";
import { None, Option, Some } from "ts-results";

function clickNextEditableCell(currentIndex: number) {
    const allEditableCells = document.querySelectorAll(".editable-cell");
    const nextEditableCell = allEditableCells[currentIndex + 1] as HTMLElement;

    if (nextEditableCell) {
        nextEditableCell.click();
    }
}

export default function EditableCell<T extends object>({
    index,
    tableRow,
    initValue,
    submitFn,
    ...props
}: {
  index: number;
  tableRow: T;
  submitFn: (row: T, value: unknown) => Promise<HfsError | void>;
  onBlurFocusNext: boolean;
  initValue: Option<string>;
} & InputProps) {
    const [value, setValue] = useState<Option<string>>(initValue);
    const [error, setError] = useState<Option<HfsError>>(None);
    const [isEditable, setIsEditable] = useState<boolean>(false);

    if (isEditable) {
        return (
            <Input
                autoFocus
                classNames={{
                    input: "editable-cell editable-cell_active z-50"
                }}
                value={value.unwrapOr("")}
                onFocus={(e) => {(e.target as HTMLInputElement).select();}}
                onBlur={async () => {
                    setError(None);
                    setIsEditable(false);
                    if (
                        value == None ||
                        value == initValue
                    ) {
                        return;
                    }
                    const error = await submitFn(tableRow, value);

                    if (error) {
                        setError(Some(error));
                    } else {
                        setValue(value);
                    }

                }}
                onChange={(e) => {
                    setValue(Some(e.target.value));
                }}
                onKeyDown={async(e) => {
                    if (["Enter", "Tab"].includes(e.key)) {
                        e.preventDefault();
                        setError(None);
                        clickNextEditableCell(index);
                        if (
                            value == None ||
                            value == initValue
                        ) {
                            setIsEditable(false);
                            return;
                        }
                        setIsEditable(false);
                        const error = await submitFn(tableRow, value);

                        if (error) {
                            setError(Some(error));
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
                    "editable-cell editable-cell_inactive flex flex-col z-50 cursor-pointer place-content-center",
                    props.className,
                )}
                onClick={() => {
                    setIsEditable(true);
                }}
            >
                {error.some ? (
                    <span className="text-[10px] text-red-500">{error.val.message}</span>
                ) : (
                    <span className="text-tertiary underline">{value.some ? value.val : initValue.some ? initValue.val : ""}</span>
                )}
            </div>
        );
    }
}
