import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const price = (item.price_cents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD'
  });
  
  return (
    <Link to={`/shop/${item.slug}`} className="block transition-transform hover:scale-105">
      <Card className="glass-card border-white/15 bg-black/40 text-white h-full overflow-hidden">
        {item.image_url && (
          <div className="w-full h-48 bg-white/5 flex items-center justify-center">
            <img 
              src={item.image_url} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <Badge variant="outline" className="ml-2 text-xs">
              {item.kind}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter>
          <p className="text-2xl font-bold bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-transparent">
            {price}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}

