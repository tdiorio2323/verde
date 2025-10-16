import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Trophy, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Gift,
    title: "Earn Credits",
    description: "Every transaction builds value. Automatic rewards on every purchase.",
    gradient: "from-white/10 to-white/5"
  },
  {
    icon: Trophy,
    title: "Unlock Tiers",
    description: "Silver. Gold. Platinum. Progress unlocks exclusive access and perks.",
    gradient: "from-white/12 to-white/6"
  },
  {
    icon: Sparkles,
    title: "Member Benefits",
    description: "Priority delivery, early product access, and curated offers.",
    gradient: "from-white/8 to-white/4"
  }
];

export default function LoyaltySection() {
  return (
    <section className="relative py-32 md:py-40 px-6 section-glass">
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/2 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none chrome-reflect" />

      <div className="relative container mx-auto">
        {/* Cinematic Header */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-gradient-holographic leading-tight tracking-tight">
            Verde Loyalty System
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Earn credits, unlock perks, and grow your access level.
          </p>
        </div>

        {/* Three Premium Benefit Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="group relative">
              {/* Outer Glow Layer */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${benefit.gradient} rounded-[2rem] opacity-0 blur-xl group-hover:opacity-40 transition-all duration-700`} />

              {/* Main Card */}
              <div className="relative liquid-glass rounded-[2rem] shadow-glass-xl hover:shadow-glow-sm transition-all duration-700 h-full border-2 border-white/[0.15] group-hover:border-white/[0.25] backdrop-blur-3xl overflow-hidden">
                {/* Top Gradient Accent */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${benefit.gradient} opacity-70`} />

                {/* Inner Shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent pointer-events-none chrome-reflect" />

                <CardContent className="relative p-10 text-center">
                  {/* Premium Icon Container */}
                  <div className="mx-auto mb-8 relative">
                    {/* Icon Glow Background */}
                    <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-700 scale-150" style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                    }} />

                    {/* Icon Glass Container */}
                    <div className="relative p-6 rounded-2xl glass-lg w-fit mx-auto border border-white/[0.15] group-hover:border-white/[0.25] group-hover:shadow-glow-sm transition-all duration-700 group-hover:scale-110 metallic-glow">
                      <benefit.icon className="h-11 w-11 text-primary group-hover:text-foreground transition-colors duration-700" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                    {benefit.title}
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="text-center">
          <div className="relative inline-block">
            {/* Button Glow Background */}
            <div className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-smooth" style={{
              background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
            }} />

            <Button
              size="lg"
              className="
                relative text-xl px-14 py-8 rounded-full font-bold
                btn-holographic
                text-background
                border-2 border-white/30
                shadow-silver hover:shadow-glow hover:scale-105 hover:border-white/40
                active:scale-[0.98]
                transition-all duration-500
                before:content-[''] before:absolute before:inset-0 before:rounded-full
                before:bg-gradient-to-b before:from-white/30 before:via-white/15 before:to-transparent
                before:pointer-events-none
              "
            >
              <span className="relative z-10 flex items-center gap-3">
                Sign Up Free
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
