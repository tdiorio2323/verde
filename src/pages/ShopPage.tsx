import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShopCard from '@/components/ShopCard';
import { listShopItems } from '@/lib/shop';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Home, User } from 'lucide-react';
import { useCart } from '@/stores/cart';
import { useAuth } from '@/contexts/AuthContext';

export default function ShopPage() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const cartItems = useCart(s => s.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const { user } = useAuth();
  
  useEffect(() => {
    setLoading(true);
    listShopItems(undefined, q).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, [q]);
  
  return (
    <main className="relative min-h-screen text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/20 via-purple-950/30 to-amber-950/20" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Header with Logo and Navigation */}
        <header className="liquid-glass relative overflow-hidden rounded-3xl border border-white/15 bg-black/40 p-6 shadow-glass-xl sm:p-8 mb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-inner">
                <img src="/images/verde-transparent-logo.png" alt="Verde logo" className="h-16 w-auto" loading="lazy" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">TD Studios</p>
                <h1 className="bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
                  Shop
                </h1>
                <p className="mt-1 text-sm text-white/60">Premium products & design services</p>
              </div>
            </div>
            
            {/* Navigation and Cart */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/">
                <Button variant="ghost" className="glass-md hover:bg-white/10 text-white/70 hover:text-white">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              
              {user && (
                <Link to="/dashboard">
                  <Button variant="ghost" className="glass-md hover:bg-white/10 text-white/70 hover:text-white">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              
              <Link to="/cart">
                <Button className="relative glass-md bg-white/10 hover:bg-white/20 border-white/20">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Search */}
        <div className="mb-8">
          <Input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search products and services..."
            className="glass-md max-w-md border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-white" />
              <p className="mt-4 text-white/70">Loading shop items...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-white/60">No items found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(it => (
              <ShopCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

