import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Leaf, Truck } from "lucide-react";

const trustPoints = [
  {
    icon: Heart,
    title: "Community First",
    description: "Building relationships between neighbors, not just transactions"
  },
  {
    icon: Users,
    title: "Local Brands",
    description: "Supporting small businesses and artisan cultivators in your area"
  },
  {
    icon: Leaf,
    title: "Premium Quality",
    description: "Curated selection of tested, compliant cannabis products"
  },
  {
    icon: Truck,
    title: "Safe Delivery",
    description: "Secure, discreet delivery with verified age and compliance checks"
  }
];

export default function TrustSection() {
  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-background via-glass-base to-background">
      {/* Background glass overlay */}
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gradient-holographic">
            Why Choose TD Studios?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            More than a marketplace—we're building a trusted community where
            quality, safety, and relationships come first.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {trustPoints.map((point, index) => (
            <div key={index} className="group">
              <div className="glass-card rounded-3xl shadow-glass-xl hover:shadow-glow-sm transition-smooth h-full">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 p-5 rounded-2xl glass-lg w-fit group-hover:shadow-glow-sm transition-smooth">
                    <point.icon className="h-9 w-9 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {point.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}