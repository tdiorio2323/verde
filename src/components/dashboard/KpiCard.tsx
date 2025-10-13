import { ReactNode } from "react";

export type KpiCardProps = {
  label: string;
  value: string;
  helper?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
};

const trendStyles: Record<NonNullable<KpiCardProps["trend"]>, string> = {
  up: "text-emerald-300",
  down: "text-amber-200",
  neutral: "text-white/60",
};

const KpiCard = ({ label, value, helper, trend = "neutral", icon }: KpiCardProps) => {
  return (
    <div className="liquid-glass flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/5 p-5 text-white shadow-glass-xl transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/60">
        <span>{label}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-semibold leading-none text-white">{value}</span>
        {helper && <span className={`text-xs font-semibold ${trendStyles[trend]}`}>{helper}</span>}
      </div>
    </div>
  );
};

export default KpiCard;
