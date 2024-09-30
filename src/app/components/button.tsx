import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Button({ className, ...args }: ButtonHTMLAttributes<HTMLButtonElement>) {
    const classes = twMerge(DEFAULT_STYLE, className);
    return (
        <button {...args} className={classes} />
    );
}

const DEFAULT_STYLE = "border border-black rounded";
