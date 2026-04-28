import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  change?: string | null;
  changeColor?: string;
  className?: string;
}

export function StatCard({ label, value, icon, change, changeColor = "text-emerald-500", className = "" }: StatCardProps) {
  const formatted = typeof value === "number" ? value.toLocaleString("pt-BR") : value;

  return (
    <div className={`rounded-xl border border-border/60 bg-card py-4 px-4 flex flex-col gap-1.5 shadow-sm hover:shadow-md hover:border-border/80 transition-all cursor-default group ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground tracking-wide">{label}</span>
        {icon && (
          <div className="w-7 h-7 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground/60 group-hover:text-foreground group-hover:bg-muted/60 transition-all" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold leading-none text-foreground tracking-tight">
        {formatted}
      </div>
      {change && (
        <p className="text-[11px] text-muted-foreground">
          <span className={changeColor}>{change}</span>
        </p>
      )}
    </div>
  );
}
