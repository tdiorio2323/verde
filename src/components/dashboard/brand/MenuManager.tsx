
export function MenuManager({ brandId }: { brandId: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold mb-3">Menu Manager</h2>
      <p className="text-sm text-neutral-500">Create menus, add products, set public/private.</p>
      {/* wire later: menus + products CRUD via Supabase */}
    </div>
  );
}
