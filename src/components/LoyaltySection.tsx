import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Users, Trophy, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Gift,
    title: "Earn on Every Order",
    description: "Collect 10 points per $1 spent. Redeem anytime for discounts and free products."
  },
  {
    icon: Users,
    title: "Refer & Earn $20",
    description: "Share your code. When friends place their first order, you both get $20 credit."
  },
  {
    icon: Trophy,
    title: "Level Up for Perks",
    description: "Unlock tiers: Silver, Gold, Platinum. Get early access to new drops and exclusive deals."
  },
  {
    icon: Sparkles,
    title: "VIP Treatment",
    description: "Birthday surprises, free delivery upgrades, and members-only flash sales."
  }
];

export default function LoyaltySection() {
  return (
    <section className="relative py-32 px-6 section-glass">
      {/* Background glass overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gradient-holographic">
            Join The Candy Club Rewards
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Turn every order into rewards. Earn points automatically, refer friends for instant credit,
            and unlock VIP perks as you level up.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="glass-card rounded-3xl shadow-glass-xl hover:shadow-glow transition-smooth h-full">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 p-5 rounded-2xl glass-lg w-fit group-hover:shadow-glow-sm transition-smooth">
                    <benefit.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="
              text-xl px-12 py-7 rounded-full font-bold
              bg-gradient-holographic
              border border-white/20
              shadow-golden hover:shadow-glow hover:scale-105
              transition-smooth
              relative
              before:content-[''] before:absolute before:inset-0 before:rounded-full
              before:bg-gradient-to-b before:from-white/20 before:to-white/5
              before:pointer-events-none
            "
          >
            <span className="relative z-10">Sign Up Free</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
