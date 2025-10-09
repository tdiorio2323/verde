import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import candymanExotics from "@/assets/candyman-exotics.jpg";

const brands = [
  {
    name: "Candyman Exotics",
    image: candymanExotics,
    rating: 4.9,
    reviews: 247,
    deliveryTime: "30-45 min",
    distance: "2.1 mi",
    specialty: "Premium Edibles",
    badge: "Top Rated"
  },
  {
    name: "Green Valley Farms",
    image: candymanExotics,
    rating: 4.7,
    reviews: 189,
    deliveryTime: "25-40 min",
    distance: "1.8 mi",
    specialty: "Organic Flower",
    badge: "Certified"
  },
  {
    name: "Pacific Coast Collective",
    image: candymanExotics,
    rating: 4.8,
    reviews: 312,
    deliveryTime: "35-50 min",
    distance: "3.2 mi",
    specialty: "Concentrates",
    badge: "Popular"
  },
  {
    name: "Sunset Wellness",
    image: candymanExotics,
    rating: 4.6,
    reviews: 156,
    deliveryTime: "20-35 min",
    distance: "1.2 mi",
    specialty: "Wellness Products",
    badge: "New"
  }
];

export default function ExploreMenus() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent">
            Featured Drops & Local Favorites
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse top-rated dispensaries near you. Each menu features lab-tested products, 
            real customer reviews, and fast delivery times.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {brands.map((brand, index) => (
            <Card 
              key={index} 
              className="bg-card/50 border-border/50 backdrop-blur-sm hover:scale-105 hover:shadow-glow transition-smooth group overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                  {brand.badge}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  {brand.name}
                </CardTitle>
                <CardDescription className="text-accent font-medium">
                  {brand.specialty}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-golden text-golden" />
                    <span className="font-semibold text-foreground">{brand.rating}</span>
                    <span className="text-muted-foreground">({brand.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{brand.distance}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{brand.deliveryTime}</span>
                </div>
                
                <Button variant="holographic" className="w-full">
                  View Menu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
