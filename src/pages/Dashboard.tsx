import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth/hook";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ShopView from "@/components/dashboard/ShopView";
import CartDrawer from "@/components/dashboard/CartDrawer";
import OrderTracking from "@/components/dashboard/OrderTracking";
import DriverView from "@/components/dashboard/DriverView";
import AdminView from "@/components/dashboard/AdminView";
import CheckoutModal from "@/components/dashboard/CheckoutModal";
import { useAppStore } from "@/stores/appStore";
import { calculateTotals } from "@/stores/appStore";
import type { CheckoutPayload, Role } from "@/shared/types/app";

const roleOptions = [
  { id: "customer" as const, label: "Customer", description: "Browse, curate, track orders" },
  { id: "driver" as const, label: "Driver", description: "Live runs & premium handoffs" },
  { id: "admin" as const, label: "Admin", description: "Command center insights" },
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const session = useAppStore((state) => state.session);
  const activeOrder = useAppStore((state) =>
    state.orders.list.find((order) => order.id === state.orders.activeOrderId) ?? null,
  );
  const totals = useAppStore((state) =>
    calculateTotals(state.cart, state.cart.items, state.products),
  );
  const cart = useAppStore((state) => state.cart);
  const dispensaries = useAppStore((state) => state.dispensaries);
  const setRole = useAppStore((state) => state.setRole);
  const checkout = useAppStore((state) => state.checkout);
  const advanceActiveOrderStatus = useAppStore((state) => state.advanceActiveOrderStatus);
  const cartItems = cart.items;
  const dispensaryName = useMemo(() => {
    const selected = dispensaries.find((item) => item.id === session.selectedDispensaryId);
    return selected?.name ?? "Verde";
  }, [dispensaries, session.selectedDispensaryId]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync user role from Supabase to store
  useEffect(() => {
    if (user && user.role !== session.role) {
      setRole(user.role);
    }
  }, [user, session.role, setRole]);

  useEffect(() => {
    if (location.pathname.includes("/dashboard/driver") && session.role !== "driver") {
      setRole("driver");
    } else if (location.pathname.includes("/dashboard/admin") && session.role !== "admin") {
      setRole("admin");
    } else if (location.pathname === "/dashboard" && session.role !== "customer") {
      setRole("customer");
    }
  }, [location.pathname, session.role, setRole]);

  const handleRoleChange = (value: string) => {
    const role = value as Role;
    if (role === session.role) return;
    setRole(role);
    if (role === "customer") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate(`/dashboard/${role}`, { replace: true });
    }
  };

  const handleCheckoutConfirm = (payload: CheckoutPayload) => {
    const success = checkout(payload);

    if (success) {
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been confirmed and is being prepared.",
      });
    } else {
      toast({
        title: "Checkout Failed",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      });
    }
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  return (
    <main id="main-content" className="relative min-h-screen text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />

      {/* Chrome metallic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/20 via-purple-950/30 to-amber-950/20" />

      {/* Animated mesh gradient - subtler for dashboard */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float" />
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float"
          style={{ animationDelay: "var(--animation-delay-1)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-500/15 rounded-full mix-blend-screen filter blur-3xl animate-float"
          style={{ animationDelay: "var(--animation-delay-2)" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-24 pt-12 sm:px-6">
        <header className="liquid-glass relative overflow-hidden rounded-3xl border border-white/15 bg-black/40 p-6 shadow-glass-xl sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-inner">
                <img
                  src="/images/verde-transparent-logo.png"
                  alt="Verde logo"
                  className="h-16 w-auto"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Verde Delivery Cloud
                </p>
                <h1 className="bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
                  Multi-role experience hub
                </h1>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="text-sm text-white/70">
                <p className="font-semibold text-white">Current lounge</p>
                <p>{dispensaryName}</p>
                <p>{cartCount} items in cart</p>
              </div>
              <div className="flex items-center gap-2 border-l border-white/15 pl-4">
                <div className="text-xs text-white/70">
                  <p className="font-semibold text-white">{user?.fullName || "Guest"}</p>
                  <p>{user?.phone}</p>
                </div>
                <Button
                  onClick={() => signOut().then(() => navigate("/"))}
                  variant="ghost"
                  size="sm"
                  className="glass-md hover:bg-white/10 text-white/70 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <Tabs value={session.role} onValueChange={handleRoleChange}>
          <TabsList
            className="flex w-full flex-col gap-3 rounded-3xl border border-white/15 bg-white/5 p-3 text-white shadow-glass md:flex-row"
            role="tablist"
            aria-label="Role selection"
          >
            {roleOptions.map((option) => (
              <TabsTrigger
                key={option.id}
                value={option.id}
                className="group flex-1 rounded-2xl border border-transparent bg-transparent px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.2em] text-white/60 transition-all duration-300 data-[state=active]:border-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400/30 data-[state=active]:via-purple-400/20 data-[state=active]:to-amber-200/20 data-[state=active]:text-white"
                role="tab"
                aria-label={`Switch to ${option.label} view: ${option.description}`}
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
                <OrderTracking
                  order={activeOrder}
                  onAdvance={advanceActiveOrderStatus}
                />
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
