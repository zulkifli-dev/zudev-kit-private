import { Card, CardContent } from "@zudev/ui/components/card";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface DashboardMetricCardProps {
  label: string;
  value: string;
  change: string;
  detail: string;
  icon: LucideIcon;
  trend?: "up" | "down";
}

export function DashboardMetricCard({
  label,
  value,
  change,
  detail,
  icon: Icon,
  trend = "up",
}: DashboardMetricCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="gap-5 py-5 shadow-none">
      <CardContent className="px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-[28px] leading-none font-semibold tracking-tight">
              {value}
            </p>
          </div>
          <div className="grid size-9 place-items-center rounded-lg border bg-background text-muted-foreground">
            <Icon className="size-4" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${trend === "up" ? "text-emerald-700" : "text-amber-700"}`}
          >
            <TrendIcon className="size-3.5" aria-hidden="true" />
            {change}
          </span>
          <span className="text-muted-foreground">{detail}</span>
        </div>
      </CardContent>
    </Card>
  );
}
