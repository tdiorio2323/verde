import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Store, Shield } from "lucide-react";

const roles = [
  {
    icon: ShoppingCart,
    title: "Shoppers",
    subtitle: "Browse. Order. Delivered.",
    description: "Discover verified products from licensed dispensaries. Real-time inventory, transparent pricing, and secure delivery to your door.",
    features: [
      "Live inventory and pricing",
      "Verified product reviews",
      "Loyalty rewards automatically applied",
      "Same-day discreet delivery"
    ],
    cta: "Start Shopping",
    gradient: "from-white/10 to-white/5"
  },
  {
    icon: Store,
    title: "Creators",
    subtitle: "Build. Engage. Scale.",
    description: "Your brand, your storefront, your audience. Manage menus, track performance, and grow with built-in tools designed for modern brands.",
    features: [
      "Custom branded storefront",
      "Real-time menu control",
      "Customer insights and analytics",
      "Integrated marketing suite"
    ],
    cta: "List Your Brand",
    gradient: "from-white/12 to-white/6"
  },
  {
    icon: Shield,
    title: "Operators",
    subtitle: "Monitor. Verify. Scale.",
    description: "Oversee platform operations with precision. Maintain compliance, verify licenses, and manage transactions with enterprise-grade tools.",
    features: [
      "License and compliance verification",
      "Full transaction monitoring",
      "Dispute resolution workflows",
      "Platform-wide analytics dashboard"
    ],
    cta: "Admin Dashboard",
    gradient: "from-white/8 to-white/4"
  }
];

export default function UserRoles() {
  return (
    <section className="relative py-32 md:py-40 px-6 bg-gradient-to-b from-background via-background/95 to-background">
      {/* Subtle Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto">
        {/* Section Header with Cinematic Spacing */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-gradient-holographic leading-tight tracking-tight">
            A Platform Built for Everyone
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Built for those who design, build, and scale.
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mt-4">
            TD Studios delivers the digital infrastructure for modern dispensaries and creative brands.
          </p>
        </div>

        {/* Premium Layered Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <div key={index} className="group relative">
              {/* Outer Glow Layer */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${role.gradient} rounded-[2rem] opacity-0 blur-xl group-hover:opacity-40 transition-all duration-700`} />

              {/* Main Card */}
              <div className="relative liquid-glass rounded-[2rem] shadow-glass-xl hover:shadow-glow-sm transition-all duration-700 h-full border-2 border-white/[0.15] group-hover:border-white/[0.25] backdrop-blur-3xl overflow-hidden">
                {/* Top Gradient Accent */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${role.gradient} opacity-70`} />

                {/* Inner Shine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent pointer-events-none chrome-reflect" />

                <CardHeader className="relative text-center pt-12 pb-8">
                  {/* Icon Container with Premium Glass Effect */}
                  <div className="mx-auto mb-8 relative">
                    {/* Icon Glow Background */}
                    <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-700 scale-150" style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                    }} />

                    {/* Icon Glass Container */}
                    <div className="relative p-6 rounded-2xl glass-lg w-fit mx-auto border border-white/[0.15] group-hover:border-white/[0.25] group-hover:shadow-glow-sm transition-all duration-700 group-hover:scale-110 metallic-glow">
                      <role.icon className="h-11 w-11 text-foreground transition-colors duration-700" />
                    </div>
                  </div>

                  <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gradient-holographic font-semibold">
                    {role.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-8 px-8 pb-10">
                  <p className="text-muted-foreground/90 leading-relaxed text-base">
                    {role.description}
                  </p>

                  {/* Feature List with Premium Bullets */}
                  <ul className="space-y-4">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-foreground/90">
                        <div className="relative w-2 h-2 mt-2 mr-4 flex-shrink-0">
                          <div className="absolute inset-0 bg-white rounded-full blur-sm" />
                          <div className="relative w-2 h-2 bg-gradient-to-br from-white to-white/60 rounded-full" />
                        </div>
                        <span className="font-medium leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Premium CTA Button */}
                  <Button
                    className="
                      w-full rounded-full py-7 font-bold text-base
                      btn-holographic
                      text-background
                      border-2 border-white/30
                      shadow-glass hover:shadow-glow-sm hover:scale-[1.02] hover:border-white/40
                      transition-all duration-500
                      relative
                      before:content-[''] before:absolute before:inset-0 before:rounded-full
                      before:bg-gradient-to-b before:from-white/30 before:via-white/15 before:to-transparent
                      before:pointer-events-none
                    "
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {role.cta}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
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
