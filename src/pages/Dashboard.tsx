import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShopView from "@/components/dashboard/ShopView";
import CartDrawer from "@/components/dashboard/CartDrawer";
import OrderTracking from "@/components/dashboard/OrderTracking";
import DriverView from "@/components/dashboard/DriverView";
import AdminView from "@/components/dashboard/AdminView";
import CheckoutModal from "@/components/dashboard/CheckoutModal";
import { appActions, selectors, useAppStore, type CheckoutPayload, type Role } from "@/data/store";

const roleOptions = [
  { id: "customer" as const, label: "Customer", description: "Browse, curate, track orders" },
  { id: "driver" as const, label: "Driver", description: "Live runs & premium handoffs" },
  { id: "admin" as const, label: "Admin", description: "Command center insights" },
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useAppStore(selectors.session);
  const activeOrder = useAppStore(selectors.activeOrder);
  const totals = useAppStore(selectors.cartTotals);
  const cart = useAppStore(selectors.cart);
  const dispensaries = useAppStore(selectors.dispensaries);
  const cartItems = cart.items;
  const dispensaryName = useMemo(() => {
    const selected = dispensaries.find((item) => item.id === session.selectedDispensaryId);
    return selected?.name ?? "TD Studios";
  }, [dispensaries, session.selectedDispensaryId]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/dashboard/driver") && session.role !== "driver") {
      appActions.setRole("driver");
    } else if (location.pathname.includes("/dashboard/admin") && session.role !== "admin") {
      appActions.setRole("admin");
    } else if (location.pathname === "/dashboard" && session.role !== "customer") {
      appActions.setRole("customer");
    }
  }, [location.pathname, session.role]);

  const handleRoleChange = (value: string) => {
    const role = value as Role;
    if (role === session.role) return;
    appActions.setRole(role);
    if (role === "customer") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate(`/dashboard/${role}`, { replace: true });
    }
  };

  const handleCheckoutConfirm = (payload: CheckoutPayload) => {
    appActions.checkout(payload);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: 'url(/images/twitter-image-short.jpg)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/85" />
      <div className="absolute inset-0 bg-gradient-glass" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-24 pt-12 sm:px-6">
        <header className="liquid-glass relative overflow-hidden rounded-3xl border border-white/15 bg-black/40 p-6 shadow-glass-xl sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-inner">
                <img src="/images/td-studios-logo.png" alt="TD Studios" className="h-16 w-auto" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">TD Studios Delivery Cloud</p>
                <h1 className="bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
                  Multi-role experience hub
                </h1>
              </div>
            </div>
            <div className="text-sm text-white/70">
              <p className="font-semibold text-white">Current lounge</p>
              <p>{dispensaryName}</p>
              <p>{cartCount} items in cart</p>
            </div>
          </div>
        </header>

        <Tabs value={session.role} onValueChange={handleRoleChange}>
          <TabsList className="flex w-full flex-col gap-3 rounded-3xl border border-white/15 bg-white/5 p-3 text-white shadow-glass md:flex-row">
            {roleOptions.map((option) => (
              <TabsTrigger
                key={option.id}
                value={option.id}
                className="group flex-1 rounded-2xl border border-transparent bg-transparent px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.2em] text-white/60 transition-all duration-300 data-[state=active]:border-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400/30 data-[state=active]:via-purple-400/20 data-[state=active]:to-amber-200/20 data-[state=active]:text-white"
              >
                <div className="space-y-1">
                  <span className="block text-xs text-white/50">{option.label}</span>
                  <span className="text-sm normal-case tracking-normal text-white/70 group-data-[state=active]:text-white">
                    {option.description}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="customer" className="mt-8">
            <div className="space-y-10">
              <ShopView onOpenCart={() => setIsCartOpen(true)} />
              <div className="px-4 pb-16 sm:px-6">
                <OrderTracking order={activeOrder} onAdvance={appActions.advanceActiveOrderStatus} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="driver" className="mt-8">
            <div className="px-4 pb-16 sm:px-6">
              <DriverView />
            </div>
          </TabsContent>

          <TabsContent value="admin" className="mt-8">
            <div className="px-4 pb-16 sm:px-6">
              <AdminView />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        onConfirm={handleCheckoutConfirm}
        cartTotal={totals.total}
      />
    </main>
  );
};

export default Dashboard;
