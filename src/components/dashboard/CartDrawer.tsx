import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/stores/appStore";
import { calculateTotals } from "@/stores/appStore";
import { X } from "lucide-react";

export type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: () => void;
};

const CartDrawer = ({ open, onOpenChange, onCheckout }: CartDrawerProps) => {
  const cart = useAppStore((state) => state.cart);
  const products = useAppStore((state) => state.products);
  const updateCartQuantity = useAppStore((state) => state.updateCartQuantity);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);

  const items = cart.items
    .map((item) => {
      const product = products.find((prod) => prod.id === item.productId);
      if (!product) return null;
      return {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const totals = calculateTotals(cart, cart.items, products);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#05060F]/95 text-white backdrop-blur-3xl">
        <DrawerHeader className="space-y-1 text-center">
          <DrawerTitle className="text-2xl font-semibold text-white">Luxe Cart</DrawerTitle>
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">
            curated selections, chrome protected
          </p>
        </DrawerHeader>

        <Separator className="mx-auto w-16 rounded-full border-white/20 bg-white/20" />

        <div className="px-6 pb-6 pt-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
              Your cart is empty. Explore featured collections to build a premium drop.
            </div>
          ) : (
            <ScrollArea className="max-h-[45vh] pr-2">
              <div className="space-y-4">
                {items.map(({ product, quantity, lineTotal }) => (
                  <div
                    key={product.id}
                    className="flex items-start justify-between gap-4 rounded-3xl border border-white/15 bg-white/5 p-4 shadow-glass transition hover:border-white/25"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{product.name}</p>
                      <p className="text-xs text-white/60">${product.price.toFixed(2)} each</p>
                      <p className="mt-1 text-xs text-white/50">{product.strain ?? "Curated"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        -
                      </Button>
                      <span className="min-w-[2ch] text-center text-sm font-semibold text-white">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-semibold text-white">
                        ${lineTotal.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full border border-white/15 bg-transparent text-white/60 hover:text-white"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="space-y-3 px-6 text-sm text-white/70">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Service</span>
            <span>${totals.serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>${totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery</span>
            <span>
              {totals.deliveryFee === 0 ? "Complimentary" : `$${totals.deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <Separator className="border-white/20 bg-white/20" />
          <div className="flex items-center justify-between text-lg font-semibold text-white">
            <span>Total due</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>

        <DrawerFooter>
          <div className="flex flex-col gap-3">
            <Button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="h-12 w-full rounded-full border border-white/25 bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-200 text-base font-semibold text-background shadow-glow transition-transform duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Checkout & Track
            </Button>
            <Button
              variant="ghost"
              onClick={clearCart}
              disabled={items.length === 0}
              className="h-11 rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white/70 hover:text-white"
            >
              Clear cart
            </Button>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="h-11 rounded-full border border-white/10 bg-transparent text-sm font-semibold text-white/60"
              >
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
