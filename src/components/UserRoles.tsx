import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Store, Shield } from "lucide-react";

const roles = [
  {
    icon: ShoppingCart,
    title: "Customers",
    subtitle: "Browse, Order, Enjoy",
    description: "Shop from licensed local dispensaries. Browse real-time menus, compare products and prices, read verified reviews, and track your delivery from checkout to your door.",
    features: [
      "Real-time menus & inventory",
      "Verified reviews & ratings",
      "Earn rewards on every order",
      "Same-day delivery available"
    ],
    cta: "🍬 Start Shopping",
    ctaVariant: "holographic" as const
  },
  {
    icon: Store,
    title: "Brands",
    subtitle: "Manage, Engage, Grow",
    description: "Reach customers directly through your own storefront. Update menus in real-time, run promotions, respond to reviews, and build customer loyalty—all from one dashboard.",
    features: [
      "Custom storefront & branding",
      "Real-time menu management",
      "Customer insights & analytics",
      "Built-in marketing tools"
    ],
    cta: "🍭 List Your Brand",
    ctaVariant: "golden" as const
  },
  {
    icon: Shield,
    title: "Super Admin",
    subtitle: "Oversee, Protect, Scale",
    description: "Keep the marketplace safe, compliant, and running smoothly. Monitor all transactions, verify licenses, manage disputes, and maintain platform integrity with comprehensive admin tools.",
    features: [
      "License & compliance verification",
      "Transaction monitoring",
      "Dispute resolution tools",
      "Platform-wide analytics"
    ],
    cta: "Admin Dashboard",
    ctaVariant: "hero" as const
  }
];

export default function UserRoles() {
  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-background via-glass-base to-background">
      {/* Background glass overlay */}
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-holographic">
            A Platform Built for Everyone
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Whether you're ordering your favorites, growing your brand, or managing the marketplace,
            TD Studios delivers the tools you need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <div key={index} className="group">
              <div className="glass-card rounded-3xl shadow-glass-xl hover:shadow-glow transition-smooth h-full">
                <CardHeader className="text-center pt-10 pb-8">
                  <div className="mx-auto mb-6 p-6 rounded-2xl glass-lg w-fit group-hover:shadow-glow-sm transition-smooth">
                    <role.icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-foreground mb-3">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gradient-holographic font-semibold">
                    {role.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 px-8 pb-10">
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {role.description}
                  </p>

                  <ul className="space-y-4">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-foreground">
                        <div className="w-2.5 h-2.5 bg-gradient-holographic rounded-full mr-4 mt-1.5 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

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
                    <span className="relative z-10">{role.cta}</span>
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