import type { ReactNode, HTMLAttributes } from "react";

/* ── Card ── */
export function Card({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-border/60 bg-card text-card-foreground flex flex-col shadow-sm hover:border-border/80 transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── CardHeader ── */
export function CardHeader({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-muted/30 px-5 py-3 border-b border-border/40 flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── CardTitle ── */
export function CardTitle({ children, icon, className = "" }: { children: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <h3 className={`font-semibold text-sm leading-none text-foreground flex items-center gap-2 ${className}`}>
      {icon && <span className="text-muted-foreground" aria-hidden="true">{icon}</span>}
      {children}
    </h3>
  );
}

/* ── CardAction ── */
export function CardAction({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

/* ── CardContent ── */
export function CardContent({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

/* ── CardFooter ── */
export function CardFooter({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 py-3 border-t border-border/40 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
}
