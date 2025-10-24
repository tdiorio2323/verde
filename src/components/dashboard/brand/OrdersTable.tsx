
export function OrdersTable({ brandId }: { brandId: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold mb-3">Orders</h2>
      <p className="text-sm text-neutral-500">Recent orders scoped to this brand.</p>
    </div>
  );
}
