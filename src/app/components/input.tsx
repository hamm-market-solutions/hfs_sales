import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Input({ className, ...args }: InputHTMLAttributes<HTMLInputElement>) {
    const classes = twMerge(DEFAULT_STYLE, className);
    return (
        <input {...args} className={classes} />
    );
}

const DEFAULT_STYLE = "border border-black rounded";
