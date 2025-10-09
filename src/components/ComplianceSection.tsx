import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, FileCheck, Lock, Award } from "lucide-react";

const compliancePoints = [
  {
    icon: ShieldCheck,
    title: "Age Verification",
    description: "ID checked on every delivery - 21+ only"
  },
  {
    icon: FileCheck,
    title: "Licensed Brands",
    description: "All products from state-licensed dispensaries"
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Bank-level encryption protects your data"
  },
  {
    icon: Award,
    title: "Lab Tested",
    description: "Third-party tested for purity and potency"
  }
];

export default function ComplianceSection() {
  return (
    <section className="relative py-28 px-6 section-glass">
      {/* Background glass overlay with accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-accent/5 to-primary/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-holographic">
            Safe, Legal, & Trusted
          </h3>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your safety is our priority. Every step is compliant, secure, and transparent
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {compliancePoints.map((point, index) => (
            <div key={index} className="group">
              <div className="glass-card rounded-3xl shadow-glass-xl hover:shadow-glow-sm transition-smooth text-center h-full">
                <CardContent className="p-8">
                  <div className="mx-auto mb-5 p-4 rounded-2xl glass-lg w-fit group-hover:shadow-glow-sm transition-smooth">
                    <point.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-3">
                    {point.title}
                  </h4>
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
