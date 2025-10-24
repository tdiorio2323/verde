import { useEffect } from "react";
import { useSession } from "@/shared/stores/session";
import { BrandSwitcher } from "@/components/dashboard/brand/BrandSwitcher";
import { Kpis } from "@/components/dashboard/brand/Kpis";
import { MenuManager } from "@/components/dashboard/brand/MenuManager";
import { OrdersTable } from "@/components/dashboard/brand/OrdersTable";
import { CustomersTable } from "@/components/dashboard/brand/CustomersTable";
import { InvitesPanel } from "@/components/dashboard/brand/InvitesPanel";

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