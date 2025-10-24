
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/store";
import { useToast } from "@/components/ui/use-toast";

interface ShopItem {
  id: string;
  kind: string;
  slug: string;
  title: string;
  description?: string;
  price_cents: number;
  image_url?: string;
}

export default function ShopCard({ item }: { item: ShopItem }) {
  const { add } = useCart();
  const { toast } = useToast();

  const price = (item.price_cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <Link
      to={`/shop/${item.slug}`}
      className="block transition-transform active:scale-95 sm:hover:scale-105 touch-manipulation animate-fade-in-up"
    >
      <Card className="glass-card border-white/15 bg-black/40 text-white h-full overflow-hidden flex flex-col">
        {item.image_url && (
          <div className="w-full h-48 sm:h-56 bg-white/5 flex items-center justify-center overflow-hidden">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        )}
        <CardHeader className="p-4">
          <div>
            <CardTitle className="text-base font-medium">{item.title}</CardTitle>
            <Badge variant="outline" className="text-xs mt-1">
              {item.kind}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
          <p className="text-lg font-bold bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-transparent">
            {price}
          </p>
          <Button onClick={handleAddToCart} size="sm" variant="outline" className="border-white/20 hover:bg-white/10">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
