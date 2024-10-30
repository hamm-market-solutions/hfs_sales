import { Input, InputProps } from "@nextui-org/input";
import { useState } from "react";

export default function TableInput<T extends object>({
  tableRow,
  submitFn,
  ...props
}: { tableRow: T; submitFn: (row: T, value: any) => void } & InputProps) {
  const [value, setValue] = useState<
    string | (readonly string[] & string) | undefined
  >("");

  return (
    <Input
      value={value}
      onBlur={() => {
        if (value != "") {
          submitFn(tableRow, value);
        }
      }}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
}
