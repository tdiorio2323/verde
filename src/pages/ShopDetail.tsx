import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getShopItem } from "@/lib/shop";
import { useCart } from "@/features/cart/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/shared/types/supabase";

type ShopItem = Database["public"]["Tables"]["shop_items"]["Row"] & {
  shop_item_tags?: { tag: string }[];
};

export default function ShopDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState(true);
  const add = useCart((s) => s.add);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getShopItem(slug).then(({ data }) => {
        setItem(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
          <p className="text-white/70">Loading…</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Item not found</p>
      </div>
    );
  }

  const price = (item.price_cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });

  const handleAddToCart = () => {
    add({
      id: item.id,
      slug: item.slug,
      title: item.title,
      price_cents: item.price_cents,
      image_url: item.image_url,
    });
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart.`,
    });
  };

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
          Back to Shop
        </Link>

        <Card className="glass-card border-white/15 bg-black/40 text-white overflow-hidden">
          {item.image_url && (
            <div className="w-full h-64 sm:h-80 md:h-96 bg-white/5 flex items-center justify-center">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}

          <CardHeader>
            {/* Mobile: Stack vertically, Desktop: Side by side */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl sm:text-3xl">{item.title}</CardTitle>
                <CardDescription className="mt-2 text-white/60">
                  <Badge variant="outline" className="text-xs">
                    {item.kind}
                  </Badge>
                </CardDescription>
              </div>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-transparent sm:text-right">
                {price}
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-white/80 text-lg">{item.description}</p>

            {item.shop_item_tags && item.shop_item_tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {item.shop_item_tags.map((t: { tag: string }, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-white/10">
                    {t.tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              onClick={handleAddToCart}
              className="w-full sm:flex-1 bg-gradient-to-r from-sky-500 via-purple-500 to-amber-500 hover:from-sky-600 hover:via-purple-600 hover:to-amber-600 min-h-[48px]"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Link to="/cart" className="w-full sm:flex-1">
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 min-h-[48px]"
              >
                Go to Cart
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
