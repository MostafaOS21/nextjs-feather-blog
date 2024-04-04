import { cn } from "@/lib/utils";
import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  customClass?: string;
  children?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({
  children,
  customClass,
  className,
  suffix,
  ...rest
}: InputProps) {
  return (
    <div
      className={cn(
        `input-container flex gap-2 items-center bg-secondary transition-colors border-2 border-transparent focus-within:border-violet-400
        focus-within:bg-secondary/15 rounded-sm
    px-2 py-[6px] w-fit `,
        className
      )}
    >
      {children}
      <input
        className={cn("bg-transparent outline-0 w-full flex-1", customClass)}
        {...rest}
      />
      {suffix}
    </div>
  );
}
