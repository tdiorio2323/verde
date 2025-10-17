import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/dashboard/DataTable";
import KpiCard from "@/components/dashboard/KpiCard";
import { selectors, useAppStore } from "@/data/store";

const statusTone: Record<string, string> = {
  preparing: "bg-amber-300/30 text-amber-100",
  enroute: "bg-sky-400/40 text-sky-100",
  confirmed: "bg-purple-400/30 text-purple-100",
  placed: "bg-white/20 text-white",
  delivered: "bg-emerald-400/20 text-emerald-100",
};

const orderStatuses = [
  { id: "all", label: "All statuses" },
  { id: "placed", label: "Placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "preparing", label: "Preparing" },
  { id: "enroute", label: "En Route" },
  { id: "arriving", label: "Arriving" },
  { id: "delivered", label: "Delivered" },
];

const AdminView = () => {
  const adminState = useAppStore(selectors.admin);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return adminState.orders;
    return adminState.orders.filter((order) => order.status === statusFilter);
  }, [adminState.orders, statusFilter]);

  const onlineDrivers = adminState.users.filter(
    (user) => user.role === "Driver" && user.status === "Active",
  ).length;
  const totalDrivers = adminState.users.filter((user) => user.role === "Driver").length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminState.metrics.map((metric) => (
          <KpiCard
            key={metric.metric}
            label={metric.metric}
            value={metric.value}
            helper={metric.delta}
            trend={metric.trend}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable
          title="Active queue"
          subtitle="Order orchestration"
          actions={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-[180px] rounded-full border-white/20 bg-black/40 text-xs text-white focus-visible:ring-2 focus-visible:ring-white/40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="rounded-3xl border border-white/15 bg-black/90 text-white shadow-glass-xl">
                {orderStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id} className="text-sm">
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          maxHeight={320}
        >
          <Table className="text-sm text-white/80">
            <TableHeader>
              <TableRow className="border-white/10 text-xs uppercase tracking-[0.2em] text-white/50">
                <TableHead className="text-white/60">Order</TableHead>
                <TableHead className="text-white/60">Customer</TableHead>
                <TableHead className="text-white/60">Dispensary</TableHead>
                <TableHead className="text-white/60">ETA</TableHead>
                <TableHead className="text-white/60">Basket</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-white/10">
                  <TableCell className="text-white">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`rounded-full border border-white/20 px-3 py-1 text-xs ${statusTone[order.status] ?? "bg-white/15 text-white"}`}
                      >
                        {order.status}
                      </Badge>
                      <span className="font-semibold">{order.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.dispensary}</TableCell>
                  <TableCell>{order.eta}</TableCell>
                  <TableCell>${order.basket.toFixed(0)}</TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-white/60">
                    No orders for the selected status.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DataTable>

        <div className="space-y-6">
          <DataTable title="Low stock alerts" subtitle="Inventory pulse" maxHeight={250}>
            <ul className="space-y-3 text-sm">
              {adminState.inventory.map((item) => {
                const healthy = item.stock > item.threshold;
                return (
                  <li
                    key={item.sku}
                    className="flex items-center justify-between rounded-3xl border border-white/15 bg-black/40 p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{item.sku}</p>
                      <p className="text-xs text-white/60">Threshold {item.threshold} units</p>
                    </div>
                    <Badge
                      className={`rounded-full border px-4 py-1 text-xs font-semibold ${
                        healthy
                          ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-100"
                          : "border-amber-300/40 bg-amber-300/20 text-amber-100"
                      }`}
                    >
                      {healthy ? `${item.stock} ready` : `${item.stock} low`}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </DataTable>

          <DataTable
            title="Operations roster"
            subtitle={`Drivers ${onlineDrivers}/${totalDrivers} online`}
            maxHeight={250}
          >
            <ul className="space-y-3 text-sm">
              {adminState.users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded-3xl border border-white/15 bg-black/40 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-white/60">{user.role}</p>
                  </div>
                  <Badge className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs text-white/70">
                    {user.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
