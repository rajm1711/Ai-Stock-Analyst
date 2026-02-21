import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-xl bg-primary px-4 py-2 text-body font-medium text-white transition hover:bg-[#0f2f50]",
        className
      )}
      {...props}
    />
  );
}
