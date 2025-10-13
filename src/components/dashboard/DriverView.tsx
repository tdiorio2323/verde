import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore, selectors, appActions } from "@/data/store";
import type { DriverAssignmentStatus } from "@/data/orders";

const statusColor: Record<DriverAssignmentStatus, string> = {
  assigned: "bg-white/15 text-white",
  accepted: "bg-amber-300/30 text-amber-100",
  enroute: "bg-sky-400/40 text-sky-50",
  arrived: "bg-emerald-400/40 text-emerald-50",
  delivered: "bg-white/20 text-white",
};

const statusLabel: Record<DriverAssignmentStatus, string> = {
  assigned: "Assigned",
  accepted: "Accepted",
  enroute: "En Route",
  arrived: "Arrived",
  delivered: "Delivered",
};

const nextAction: Record<DriverAssignmentStatus, { label: string; disabled: boolean }> = {
  assigned: { label: "Accept run", disabled: false },
  accepted: { label: "Start route", disabled: false },
  enroute: { label: "Mark arrived", disabled: false },
  arrived: { label: "Complete delivery", disabled: false },
  delivered: { label: "Completed", disabled: true },
};

export const DriverView = () => {
  const assignments = useAppStore(selectors.driverAssignments);

  return (
    <Card className="liquid-glass border border-white/15 bg-white/5 p-0 text-white shadow-glass-xl">
      <div className="border-b border-white/10 p-6">
        <h3 className="text-2xl font-semibold">Active runs</h3>
        <p className="text-sm text-white/60">Stay in sync with concierge-level drop offs and curated notes.</p>
      </div>
      <ScrollArea className="max-h-[70vh]">
        <div className="space-y-4 p-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-3xl border border-white/15 bg-black/40 p-5 shadow-glass"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{assignment.id}</p>
                  <h4 className="text-lg font-semibold">{assignment.customer}</h4>
                  <p className="text-sm text-white/60">{assignment.address}</p>
                </div>
                <Badge className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${statusColor[assignment.status]}`}>
                  {statusLabel[assignment.status]}
                </Badge>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  <p className="uppercase tracking-[0.25em] text-white/50">Distance</p>
                  <p className="mt-1 text-lg font-semibold text-white">{assignment.distanceMiles.toFixed(1)} mi</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  <p className="uppercase tracking-[0.25em] text-white/50">Payout</p>
                  <p className="mt-1 text-lg font-semibold text-gradient-chrome">${assignment.payout.toFixed(0)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  <p className="uppercase tracking-[0.25em] text-white/50">Timing</p>
                  <p className="mt-1 text-lg font-semibold text-white">{assignment.pickupWindow}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  <p className="uppercase tracking-[0.25em] text-white/50">Status</p>
                  <p className="mt-1 text-lg font-semibold text-white">{statusLabel[assignment.status]}</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">Manifest</p>
                <ul className="mt-2 space-y-1">
                  {assignment.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.quantity}× {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(0)}</span>
                    </li>
                  ))}
                </ul>
                {assignment.notes && (
                  <p className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                    {assignment.notes}
                  </p>
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  className="rounded-full border border-white/20 bg-gradient-to-r from-sky-400/90 via-purple-400/80 to-emerald-300/80 px-6 py-2 text-sm font-semibold text-background shadow-glow disabled:opacity-50"
                  onClick={() => appActions.updateDriverAssignment(assignment.id)}
                  disabled={nextAction[assignment.status].disabled}
                >
                  {nextAction[assignment.status].label}
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-2 text-sm font-semibold text-white/70 hover:text-white"
                >
                  Contact support
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default DriverView;
