import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CustomerOrder } from "@/data/orders";

export type OrderTrackingProps = {
  order: CustomerOrder | null;
  onAdvance?: () => void;
};

const statusProgress: Record<CustomerOrder["status"], number> = {
  placed: 10,
  confirmed: 25,
  preparing: 50,
  enroute: 75,
  arriving: 90,
  delivered: 100,
};

export const OrderTracking = ({ order, onAdvance }: OrderTrackingProps) => {
  if (!order) {
    return (
      <Card className="liquid-glass border border-white/15 bg-white/5 p-8 text-white shadow-glass-xl">
        <div className="space-y-3 text-center text-white/70">
          <h3 className="text-xl font-semibold text-white">Track orders in real time</h3>
          <p className="text-sm">
            Place an order to unlock timeline updates, driver positioning, and curated delivery
            status.
          </p>
        </div>
      </Card>
    );
  }

  const initials = order.driverName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <Card className="liquid-glass overflow-hidden border border-white/15 bg-white/5 text-white shadow-glass-xl">
        <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Order {order.id}
                </p>
                <h3 className="text-2xl font-semibold text-white">{order.address}</h3>
              </div>
              <Badge className="rounded-full border border-white/30 bg-gradient-to-r from-sky-400/80 via-purple-400/80 to-amber-200/80 text-background">
                {order.status === "preparing" ? "Curating" : order.status}
              </Badge>
            </div>
            {onAdvance && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={onAdvance}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 shadow-glass transition hover:border-white/30 hover:text-white"
                >
                  Advance status
                </Button>
              </div>
            )}
            <div className="relative h-48 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#030712]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(192,132,252,0.25),transparent_50%),radial-gradient(circle_at_60%_85%,rgba(250,204,21,0.2),transparent_55%)]" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10 flex h-full flex-col justify-between p-5 text-sm text-white/70">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Driver</p>
                  <div className="mt-2 flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-white/20">
                      <AvatarImage src={order.driverAvatar} alt={order.driverName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-white">{order.driverName}</p>
                      <p className="text-xs text-white/60">{order.vehicle}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span>Estimated arrival</span>
                  <span className="text-lg font-semibold text-white">{order.etaMinutes} min</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">progress</p>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-purple-400 to-amber-300"
                  style={{ width: `${statusProgress[order.status]}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              {order.timeline.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                    step.complete
                      ? "border-white/25 bg-white/10 text-white"
                      : "border-white/10 bg-black/30 text-white/60"
                  }`}
                >
                  <div>
                    <p className="font-semibold capitalize">{step.label}</p>
                    <p className="text-xs text-white/60">{step.at}</p>
                  </div>
                  <div
                    className={`h-2 w-2 rounded-full ${step.complete ? "bg-emerald-300" : "bg-white/30"}`}
                  />
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Items</p>
              <ul className="mt-2 space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between text-white">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderTracking;
