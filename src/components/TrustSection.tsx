import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, Heart, Truck } from "lucide-react";

const trustPoints = [
  {
    icon: Leaf,
    title: "Premium Quality",
    description: "Every product curated, tested, and verified for excellence.",
    gradient: "from-white/10 to-white/5"
  },
  {
    icon: Users,
    title: "Verified Brands",
    description: "Licensed dispensaries and trusted creators only.",
    gradient: "from-white/8 to-white/4"
  },
  {
    icon: Heart,
    title: "Secure Payments",
    description: "Bank-level encryption protects every transaction.",
    gradient: "from-white/12 to-white/6"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Discreet, professional, and compliant from door to door.",
    gradient: "from-white/10 to-white/5"
  }
];

export default function TrustSection() {
  return (
    <section className="relative py-32 md:py-40 px-6 bg-gradient-to-b from-background via-background/95 to-background">
      {/* Subtle Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto">
        {/* Cinematic Header */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-gradient-holographic leading-tight tracking-tight">
            Why TD Studios
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Because presentation, quality, and trust still matter.
          </p>
        </div>

        {/* Premium Trust Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {trustPoints.map((point, index) => (
            <div key={index} className="group relative">
              {/* Outer Glow Layer */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${point.gradient} rounded-[2rem] opacity-0 blur-xl group-hover:opacity-40 transition-all duration-700`} />

              {/* Main Card */}
              <div className="relative liquid-glass rounded-[2rem] shadow-glass-xl hover:shadow-glow-sm transition-all duration-700 h-full border-2 border-white/[0.15] group-hover:border-white/[0.25] backdrop-blur-3xl overflow-hidden">
                {/* Top Gradient Accent */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${point.gradient} opacity-70`} />

                {/* Inner Shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent pointer-events-none chrome-reflect" />

                <CardContent className="relative p-8 text-center">
                  {/* Premium Icon Container */}
                  <div className="mx-auto mb-7 relative">
                    {/* Icon Glow Background */}
                    <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-700 scale-150" style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                    }} />

                    {/* Icon Glass Container */}
                    <div className="relative p-5 rounded-2xl glass-lg w-fit mx-auto border border-white/[0.15] group-hover:border-white/[0.25] group-hover:shadow-glow-sm transition-all duration-700 group-hover:scale-110 metallic-glow">
                      <point.icon className="h-10 w-10 text-foreground transition-colors duration-700" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    {point.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed">
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
