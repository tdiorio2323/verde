import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, FileCheck, Lock, Award } from "lucide-react";

const compliancePoints = [
  {
    icon: ShieldCheck,
    title: "Age Verified",
    description: "Every delivery. 21+ only. No exceptions.",
    gradient: "from-white/10 to-white/5"
  },
  {
    icon: FileCheck,
    title: "Licensed Only",
    description: "State-licensed dispensaries and verified creators.",
    gradient: "from-white/8 to-white/4"
  },
  {
    icon: Lock,
    title: "Encrypted",
    description: "Bank-grade security for every transaction.",
    gradient: "from-white/12 to-white/6"
  },
  {
    icon: Award,
    title: "Lab Tested",
    description: "Third-party verified for purity and potency.",
    gradient: "from-white/10 to-white/5"
  }
];

export default function ComplianceSection() {
  return (
    <section className="relative py-28 md:py-36 px-6 section-glass">
      {/* Subtle Accent Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-white/2 to-white/3 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none chrome-reflect" />

      <div className="relative container mx-auto">
        {/* Authoritative Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-7 text-gradient-holographic leading-tight tracking-tight">
            Compliance & Transparency
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Every transaction. Verified. Every brand. Licensed.
          </p>
        </div>

        {/* Clean Compliance Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {compliancePoints.map((point, index) => (
            <div key={index} className="group relative">
              {/* Outer Glow Layer */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${point.gradient} rounded-[2rem] opacity-0 blur-xl group-hover:opacity-30 transition-all duration-700`} />

              {/* Main Card */}
              <div className="relative liquid-glass rounded-[2rem] shadow-glass-xl hover:shadow-glow-sm transition-all duration-700 h-full border-2 border-white/[0.15] group-hover:border-white/[0.25] backdrop-blur-3xl overflow-hidden">
                {/* Top Gradient Accent */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${point.gradient} opacity-70`} />

                {/* Inner Shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent pointer-events-none chrome-reflect" />

                <CardContent className="relative p-8 text-center">
                  {/* Premium Icon Container */}
                  <div className="mx-auto mb-6 relative">
                    {/* Icon Glow Background */}
                    <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-700 scale-150" style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                    }} />

                    {/* Icon Glass Container */}
                    <div className="relative p-4 rounded-2xl glass-lg w-fit mx-auto border border-white/[0.15] group-hover:border-white/[0.25] group-hover:shadow-glow-sm transition-all duration-700 group-hover:scale-110 metallic-glow">
                      <point.icon className="h-9 w-9 text-foreground transition-colors duration-700" />
                    </div>
                  </div>

                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-4">
                    {point.title}
                  </h4>
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
