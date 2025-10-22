import { useState } from "react";
import { Link } from "react-router-dom";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import GlowButton from "@/components/ui/GlowButton";
import Section from "@/components/layout/Section";
import FeatureCard from "@/components/ui/FeatureCard";
import Footer from "@/components/Footer";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/contexts/auth/hook";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fr } from "@/lib/motion";
import {
  ShoppingCart,
  ShieldCheck,
  CreditCard,
  Zap,
  Users,
  TrendingUp,
  Lock,
  Truck,
  LogOut,
  Store,
  Palette,
} from "lucide-react";

const LandingPage = () => {
  const { user, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden py-28 sm:py-36">
        <BackgroundGrid />

        {/* Navigation - Top Right */}
        <div className="absolute top-8 right-8 z-20">
          <div className="flex items-center gap-4">
            <Link to="/shop">
              <Button
                variant="ghost"
                size="sm"
                className="glass-md hover:bg-white/10 text-white/90 hover:text-white rounded-full"
              >
                <Store className="h-4 w-4 mr-2" />
                Shop
              </Button>
            </Link>
            <Link to="/designs">
              <Button
                variant="ghost"
                size="sm"
                className="glass-md hover:bg-white/10 text-white/90 hover:text-white rounded-full"
              >
                <Palette className="h-4 w-4 mr-2" />
                Designs
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="glass-md rounded-full px-6 py-2 border border-white/15">
                  <p className="text-sm text-white/90">{user.phone}</p>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  size="sm"
                  className="glass-md hover:bg-white/10 text-white/90 hover:text-white rounded-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowLoginModal(true)} className="btn-holographic">
                Sign In
              </Button>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 relative">
          <motion.div
            variants={fr.fadeUp()}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center gap-8 mb-8"
          >
            <img
              src="/images/verde-transparent-logo.png"
              alt="Verde Logo"
              className="w-48 sm:w-64 md:w-80 h-auto"
            />
          </motion.div>
          <motion.h1
            variants={fr.fadeUp()}
            initial="hidden"
            animate="show"
            className="text-center text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-transparent"
          >
            Curated. On-Demand. Personal.
          </motion.h1>
        </div>
      </section>

      {/* PLATFORM */}
      <Section
        id="platform"
        title="A Platform Built for Everyone"
        subtitle="For shoppers, creators, and operators."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard
            icon={<ShoppingCart size={20} className="text-sky-300" />}
            title="Shoppers"
            bullets={[
              "Licensed inventory only",
              "Real-time delivery tracking",
              "Loyalty rewards on every order",
            ]}
          />
          <FeatureCard
            icon={<Zap size={20} className="text-purple-300" />}
            title="Brand Owners"
            bullets={[
              "Audience tools & analytics",
              "Insights & monthly payouts",
              "Partner storefronts",
            ]}
          />
          <FeatureCard
            icon={<ShieldCheck size={20} className="text-amber-300" />}
            title="Operators"
            bullets={[
              "Age/ID verified checkout",
              "Menu sync & inventory",
              "Admin dashboard & reports",
            ]}
          />
        </div>
      </Section>

      {/* LOYALTY */}
      <Section
        id="loyalty"
        title="Verde Loyalty System"
        subtitle="Earn credits, unlock tiers, access member benefits."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard
            icon={<CreditCard size={20} className="text-sky-300" />}
            title="Earn Credits"
            bullets={["Every purchase adds value", "Auto accrual & tracking", "Redeem at checkout"]}
          />
          <FeatureCard
            icon={<TrendingUp size={20} className="text-purple-300" />}
            title="Unlock Tiers"
            bullets={[
              "Silver • Gold • Platinum",
              "Exclusive drops & products",
              "VIP support access",
            ]}
          />
          <FeatureCard
            icon={<Users size={20} className="text-amber-300" />}
            title="Member Benefits"
            bullets={[
              "Priority delivery slots",
              "Verified sellers only",
              "Early access to launches",
            ]}
          />
        </div>
        <div className="mt-8 flex justify-center">
          {user ? (
            <GlowButton href="/dashboard">Go to Dashboard</GlowButton>
          ) : (
            <Button
              onClick={() => setShowLoginModal(true)}
              className="btn-holographic text-lg px-8 py-6"
            >
              Sign Up Free
            </Button>
          )}
        </div>
      </Section>

      {/* WHY VERDE */}
      <Section
        id="why"
        title="Why Verde"
        subtitle="Because presentation, quality, and trust matter."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={<ShieldCheck size={20} className="text-sky-300" />}
            title="Premium Quality"
            bullets={["Curated brands only", "Strict quality standards", "No gray-market products"]}
          />
          <FeatureCard
            icon={<ShieldCheck size={20} className="text-purple-300" />}
            title="Verified Brands"
            bullets={["Licenses on file", "Audit trails maintained", "Public verification badges"]}
          />
          <FeatureCard
            icon={<Lock size={20} className="text-amber-300" />}
            title="Secure Payments"
            bullets={["PCI-compliant processing", "End-to-end encrypted", "Dispute-ready system"]}
          />
          <FeatureCard
            icon={<Truck size={20} className="text-sky-300" />}
            title="Fast Delivery"
            bullets={["Optimized routing", "Live ETA tracking", "Full LA coverage"]}
          />
        </div>
      </Section>

      {/* COMPLIANCE */}
      <Section
        id="compliance"
        title="Compliance & Transparency"
        subtitle="Every transaction verified. Every brand licensed. No exceptions."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={<ShieldCheck size={20} className="text-sky-300" />}
            title="Age/ID Verification"
            bullets={["KYC at signup", "ID re-checks enabled", "Complete audit logs"]}
          />
          <FeatureCard
            icon={<ShieldCheck size={20} className="text-purple-300" />}
            title="License Management"
            bullets={["Brand uploads required", "Auto expiry alerts", "Reviewer workflow"]}
          />
          <FeatureCard
            icon={<Lock size={20} className="text-amber-300" />}
            title="Security First"
            bullets={["TLS everywhere", "HSTS enforced", "Abuse monitoring 24/7"]}
          />
          <FeatureCard
            icon={<ShieldCheck size={20} className="text-sky-300" />}
            title="Privacy Focused"
            bullets={["Data minimization", "Strict access controls", "Auto redaction tools"]}
          />
        </div>
      </Section>

      <Footer onOpenLogin={() => setShowLoginModal(true)} />

      {/* Login Modal */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </main>
  );
};

export default LandingPage;
