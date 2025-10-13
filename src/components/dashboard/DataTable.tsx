import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export type DataTableProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  maxHeight?: number;
};

const DataTable = ({ title, subtitle, actions, children, maxHeight = 360 }: DataTableProps) => {
  return (
    <div className="liquid-glass overflow-hidden rounded-3xl border border-white/15 bg-white/5 text-white shadow-glass-xl">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{subtitle ?? "Data"}</p>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {actions}
      </div>
      <ScrollArea style={{ maxHeight }} className="pr-2">
        <div className="px-6 py-4">{children}</div>
      </ScrollArea>
    </div>
  );
};

export default DataTable;
