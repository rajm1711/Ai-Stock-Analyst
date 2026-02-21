import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<{ className?: string; title?: string; subtitle?: string }>;

export function Card({ className, title, subtitle, children }: CardProps) {
  return (
    <section className={cn("card", className)}>
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h2 className="text-section text-primary">{title}</h2>}
          {subtitle && <p className="text-body text-neutral">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
