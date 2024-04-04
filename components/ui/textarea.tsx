import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-0  placeholder:text-muted-foreground  focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          `bg-secondary ring-0 transition-colors border-2 border-transparent focus-within:border-violet-400
          focus-within:bg-secondary/15 rounded-sm
          px-2 py-[6px] w-fit`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
