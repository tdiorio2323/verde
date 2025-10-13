import { Link } from "react-router-dom";
import LoyaltySection from "@/components/LoyaltySection";
import TrustSection from "@/components/TrustSection";
import ComplianceSection from "@/components/ComplianceSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import UserRoles from "@/components/UserRoles";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-background" />
        <div className="absolute inset-0">
          <img
            src="/images/twitter-image-short.jpg"
            alt="TD Studios glass morphism backdrop"
            className="h-full w-full object-cover opacity-70"
          />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[80vh] w-full max-w-6xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-8 flex justify-center">
            <img
              src="/images/td-studios-logo.png"
              alt="TD Studios"
              className="h-32 w-auto drop-shadow-[0_20px_45px_rgba(80,160,255,0.35)]"
            />
          </div>
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-white/70">
            ULTRA PREMIUM DELIVERY EXPERIENCES
          </p>
          <h1 className="max-w-3xl bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-6xl">
            TD Canna Platform - Curated, On Demand, Personal
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Discover dispensaries across Los Angeles, sync live delivery updates, and manage operations in a single glass-morphism environment crafted by TD Studios.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="btn-holographic rounded-full px-8 py-6 text-base font-semibold text-background shadow-glow"
            >
              <Link to="/dashboard">Enter Platform</Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="rounded-full border border-white/20 bg-white/10 px-8 py-6 text-base font-semibold text-white/80 shadow-glass hover:bg-white/15"
            >
              <a href="#roles">View Roles</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="roles" className="relative z-10 bg-background/60 backdrop-blur">
        <UserRoles />
      </section>

      <LoyaltySection />
      <TrustSection />
      <ComplianceSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
