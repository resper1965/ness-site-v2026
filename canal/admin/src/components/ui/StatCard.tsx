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
    <div className={`rounded-xl border border-border/60 bg-card py-5 px-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all cursor-default group ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground/70 group-hover:text-foreground group-hover:bg-muted/60 transition-all">
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold leading-none text-foreground tracking-tight">
        {formatted}
      </div>
      {change && (
        <p className="text-xs text-muted-foreground">
          <span className={changeColor}>{change}</span>
        </p>
      )}
    </div>
  );
}
