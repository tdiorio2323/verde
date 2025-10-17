import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, setQty, remove, totalCents, clear } = useCart();
  const total = (totalCents() / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD'
  });
  
  return (
    <main className="relative min-h-screen text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/20 via-purple-950/30 to-amber-950/20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Back button */}
        <Link to="/shop" className="inline-flex items-center text-white/60 hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        
        <h1 className="bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-3xl sm:text-4xl font-bold text-transparent mb-8">
          Cart
        </h1>
        
        {items.length === 0 ? (
          <Card className="glass-card border-white/15 bg-black/40 text-white">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-white/60 mb-6">Your cart is empty.</p>
              <Link to="/shop">
                <Button>Browse Shop</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Cart items */}
            <Card className="glass-card border-white/15 bg-black/40 text-white">
              <CardHeader>
                <CardTitle>Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map(i => (
                  <div
                    key={i.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    {/* Image and Title Section - Mobile: Row, Desktop: Row */}
                    <div className="flex items-center gap-4 flex-1">
                      {i.image_url ? (
                        <img
                          src={i.image_url}
                          alt={i.title}
                          className="h-20 w-20 flex-shrink-0 rounded-lg border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 flex-shrink-0 rounded-lg border border-white/10 bg-white/5" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{i.title}</h3>
                        <p className="text-sm text-white/60">
                          ${(i.price_cents / 100).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    
                    {/* Controls Section - Mobile: Full width row, Desktop: Compact row */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60 sm:hidden">Qty:</span>
                        <Input
                          type="number"
                          min={1}
                          value={i.qty}
                          onChange={e => setQty(i.id, parseInt(e.target.value || '1'))}
                          className="w-16 sm:w-20 border-white/20 bg-white/5 text-center min-h-[44px]"
                        />
                      </div>
                      
                      <div className="w-20 sm:w-24 text-right">
                        <p className="font-semibold text-sm sm:text-base">
                          ${((i.price_cents * i.qty) / 100).toFixed(2)}
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => remove(i.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:bg-red-500/20 hover:text-red-300 min-h-[44px] min-w-[44px]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Summary */}
            <Card className="glass-card border-white/15 bg-black/40 text-white">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span className="bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-transparent">
                    {total}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  onClick={clear}
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 hover:bg-white/10 min-h-[48px]"
                >
                  Clear Cart
                </Button>
                <Button
                  className="w-full sm:flex-1 bg-gradient-to-r from-sky-500 via-purple-500 to-amber-500 hover:from-sky-600 hover:via-purple-600 hover:to-amber-600 min-h-[48px]"
                  disabled
                >
                  Checkout (Coming Soon)
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}

