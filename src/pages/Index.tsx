import Hero from "@/components/Hero";
import UserRoles from "@/components/UserRoles";
import LoyaltySection from "@/components/LoyaltySection";
import TrustSection from "@/components/TrustSection";
import ComplianceSection from "@/components/ComplianceSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <UserRoles />
      <LoyaltySection />
      <TrustSection />
      <ComplianceSection />
      <Footer />
    </main>
  );
};

export default Index;
