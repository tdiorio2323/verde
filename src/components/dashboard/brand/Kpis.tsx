
export function Kpis({ brandId }: { brandId: string }) {
  // minimal placeholder KPIs
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {["Revenue", "Orders", "AOV", "Active Cust."].map((k) => (
        <div key={k} className="rounded-2xl border p-4">
          <div className="text-xs text-neutral-500">{k}</div>
          <div className="text-xl font-semibold mt-1">—</div>
        </div>
      ))}
    </section>
  );
}
