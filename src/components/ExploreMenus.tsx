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
    badge: "Top Rated",
  },
  {
    name: "Green Valley Farms",
    image: candymanExotics,
    rating: 4.7,
    reviews: 189,
    deliveryTime: "25-40 min",
    distance: "1.8 mi",
    specialty: "Organic Flower",
    badge: "Certified",
  },
  {
    name: "Pacific Coast Collective",
    image: candymanExotics,
    rating: 4.8,
    reviews: 312,
    deliveryTime: "35-50 min",
    distance: "3.2 mi",
    specialty: "Concentrates",
    badge: "Popular",
  },
  {
    name: "Sunset Wellness",
    image: candymanExotics,
    rating: 4.6,
    reviews: 156,
    deliveryTime: "20-35 min",
    distance: "1.2 mi",
    specialty: "Wellness Products",
    badge: "New",
  },
];

export default function ExploreMenus() {
  return (
    <section className="relative py-32 px-6 section-glass">
      {/* Background glass overlay */}
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-holographic">
            Featured Drops & Local Favorites
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Browse top-rated dispensaries near you. Each menu features lab-tested products, real
            customer reviews, and fast delivery times.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {brands.map((brand, index) => (
            <div key={index} className="group">
              <div className="glass-card rounded-3xl overflow-hidden shadow-glass-xl hover:shadow-glow transition-smooth">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-4 right-4 glass border border-white/20 text-foreground font-bold px-4 py-1.5 text-sm shadow-glass">
                    {brand.badge}
                  </Badge>
                </div>

                <CardHeader className="space-y-3 pb-4">
                  <CardTitle className="text-2xl text-foreground font-bold">{brand.name}</CardTitle>
                  <CardDescription className="text-base text-gradient-holographic font-semibold">
                    {brand.specialty}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-golden text-golden" />
                      <span className="font-bold text-foreground text-base">{brand.rating}</span>
                      <span className="text-muted-foreground">({brand.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{brand.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">{brand.deliveryTime}</span>
                  </div>

                  <Button
                    className="
                      w-full rounded-full py-6 font-bold text-base
                      bg-gradient-holographic
                      border border-white/20
                      shadow-glow-sm hover:shadow-golden hover:scale-[1.02]
                      transition-smooth
                      relative
                      before:content-[''] before:absolute before:inset-0 before:rounded-full
                      before:bg-gradient-to-b before:from-white/20 before:to-white/5
                      before:pointer-events-none
                    "
                  >
                    <span className="relative z-10">View Menu</span>
                  </Button>
                </CardContent>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
