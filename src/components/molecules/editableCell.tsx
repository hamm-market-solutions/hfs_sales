"use client";

import { Input, InputProps } from "@heroui/input";
import { useState } from "react";
import clsx from "clsx";
import { HfsError } from "@/lib/errors/HfsError";
import { isNone, isSome, None, Some, unwrapOr } from "@/utils/fp-ts";
import { Option } from "fp-ts/lib/Option";

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
                    input: "editable-cell editable-cell_active z-50 max-w-[105px]",
                    mainWrapper: "max-w-[105px]"
                }}
                value={unwrapOr(value, "")}
                onFocus={(e) => {(e.target as HTMLInputElement).select();}}
                onBlur={async () => {
                    setError(None);
                    setIsEditable(false);
                    if (
                        isNone(value) ||
                        value == initValue
                    ) {
                        return;
                    }
                    const error = await submitFn(tableRow, value.value);

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
                            isNone(value) ||
                            value == initValue
                        ) {
                            setIsEditable(false);
                            return;
                        }
                        setIsEditable(false);
                        const error = await submitFn(tableRow, value.value);

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
                {isSome(error) ? (
                    <p className="text-[10px] text-red-500">{error.value.message}</p>
                ) : (
                    <p className="text-tertiary underline">{isSome(value) ? value.value : isSome(initValue) ? initValue.value : ""}</p>
                )}
            </div>
        );
    }
}
