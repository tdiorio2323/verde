import { useState } from "react";
import { categories } from "@/data/categories";
import products from "@/data/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("pre-packaged-flower");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filtered = products.filter(p => p.category === selectedCategory);

  const addToCart = (item: typeof products[0]) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main
      className="min-h-screen text-white bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/images/twitter-image-short.jpg)' }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      {/* Header with luxury glass morphism */}
      <div className="relative liquid-glass border-b border-border-glass/50 p-6 shadow-glass-xl">
        <div className="flex justify-center">
          <img
            src="/images/td-studios-logo.png"
            alt="TD Studios"
            className="h-36 w-auto animate-breathe metallic-glow"
            style={{
              filter: 'drop-shadow(0 0 35px rgba(255, 255, 255, 0.2))'
            }}
          />
        </div>
      </div>

      {/* Category Slider with premium glass styling */}
      <div className="relative sticky top-0 z-20 liquid-glass border-b border-border-glass/50 shadow-glass chrome-reflect">
        <div className="flex overflow-x-auto gap-3 px-6 py-4 scrollbar-hide">
          {categories.map(cat => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                rounded-full px-6 py-3 text-sm font-bold whitespace-nowrap
                transition-glass
                ${cat.id === selectedCategory
                  ? "btn-holographic text-background shadow-glow-sm border border-white/30"
                  : "glass-sm text-white/90 hover:bg-white/[0.12] hover:border-white/[0.25]"}
              `}
              variant="ghost"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Product List with luxury cards */}
      <div className="relative space-y-5 px-6 py-8 pb-32">
        {filtered.map(p => (
          <div
            key={p.id}
            className="
              liquid-glass
              rounded-3xl
              shadow-glass-xl
              hover:shadow-glow-sm
              transition-glass
              overflow-hidden
              border-2 border-white/[0.12]
              hover:border-white/[0.2]
            "
          >
            <div className="flex items-center gap-5 p-5">
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/[0.15] shadow-glass"
                />
                {/* Subtle shine effect on image */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent pointer-events-none chrome-reflect" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-lg truncate">{p.name}</h3>
                <p className="text-base font-bold text-gradient-chrome">${p.price.toFixed(2)}</p>
              </div>
              <Button
                onClick={() => addToCart(p)}
                className="
                  relative rounded-full px-6 py-3 text-sm font-bold
                  btn-holographic
                  text-background
                  shadow-glow-sm
                  hover:shadow-silver hover:scale-105
                  transition-smooth
                  border border-white/30
                  before:content-[''] before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-b before:from-white/30 before:to-white/10
                  before:pointer-events-none
                "
              >
                <span className="relative z-10">Add</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Luxury Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 liquid-glass border-t border-border-glass/50 shadow-glass-xl">
          <div className="container mx-auto px-6 py-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-semibold text-foreground text-sm">
                {totalItems} item{totalItems > 1 ? "s" : ""}
              </p>
              <p className="text-gradient-chrome font-bold text-2xl">${totalPrice.toFixed(2)}</p>
            </div>
            <button
              className="
                relative rounded-full px-10 py-4 font-bold text-lg
                btn-holographic
                text-background
                shadow-glow hover:shadow-silver hover:scale-105
                transition-smooth
                border border-white/30
                before:content-[''] before:absolute before:inset-0 before:rounded-full
                before:bg-gradient-to-b before:from-white/30 before:to-white/10
                before:pointer-events-none
              "
            >
              <span className="relative z-10">Checkout</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
