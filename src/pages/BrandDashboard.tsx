import { useEffect } from "react";
import { useSession } from "@/shared/stores/session";
import { supabase } from "@/shared/lib/supabaseClient";

export default function BrandDashboard() {
  const { brandId, refresh } = useSession();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!brandId) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Select a Brand</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Your account is not linked to a brand yet or you have multiple brands. Add one or choose
          active brand.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Brand Admin</h1>
          <p className="text-sm text-neutral-500">Manage menu, orders, and customers</p>
        </div>
        {/* brand switcher placeholder */}
        <BrandSwitcher />
      </header>

      <Kpis brandId={brandId} />

      <section className="grid gap-6 lg:grid-cols-2">
        <MenuManager brandId={brandId} />
        <OrdersTable brandId={brandId} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <CustomersTable brandId={brandId} />
        <InvitesPanel brandId={brandId} />
      </section>
    </main>
  );
}

function BrandSwitcher() {
  const { brandIds, brandId, setActiveBrand } = useSession();
  if (brandIds.length <= 1) return null;
  return (
    <select
      className="border rounded-md px-3 py-2 text-sm"
      value={brandId ?? ""}
      onChange={(e) => setActiveBrand(e.target.value || null)}
    >
      {brandIds.map((id) => (
        <option key={id} value={id}>
          {id}
        </option>
      ))}
    </select>
  );
}

function Kpis({ brandId }: { brandId: string }) {
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

function MenuManager({ brandId }: { brandId: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold mb-3">Menu Manager</h2>
      <p className="text-sm text-neutral-500">Create menus, add products, set public/private.</p>
      {/* wire later: menus + products CRUD via Supabase */}
    </div>
  );
}

function OrdersTable({ brandId }: { brandId: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold mb-3">Orders</h2>
      <p className="text-sm text-neutral-500">Recent orders scoped to this brand.</p>
    </div>
  );
}

function CustomersTable({ brandId }: { brandId: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold mb-3">Customers</h2>
      <p className="text-sm text-neutral-500">Customer list and contact info.</p>
    </div>
  );
}

function InvitesPanel({ brandId }: { brandId: string }) {
  async function createInvite(email: string) {
    const token = crypto.randomUUID();
    await supabase.from("brand_invites").insert({
      brand_id: brandId,
      email,
      token,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    });
    // send email via your mailer with invite URL: /invite?token=...
  }
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold mb-3">Invite Brand Admins</h2>
      <p className="text-sm text-neutral-500">Generate invite links for owners/managers.</p>
    </div>
  );
}
