import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background via-glass-base to-background border-t border-border-glass/50">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto px-6 py-20">
        {/* CTA Section with glass card */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="glass-card p-12 rounded-3xl shadow-glass-xl">
            <div className="flex justify-center mb-8">
              <img
                src="/images/td-studios-logo.png"
                alt="TD Studios"
                className="h-28 w-auto animate-breathe"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.25))'
                }}
              />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-holographic">
              Experience TD Studios Platform
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Discover luxury digital storefront experiences for dispensaries and creative brands.
              Join us in redefining digital commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                size="lg"
                className="
                  text-lg px-10 py-6 rounded-full font-bold
                  bg-gradient-holographic
                  border border-white/20
                  shadow-glow hover:shadow-golden hover:scale-[1.02]
                  transition-smooth
                  relative
                  before:content-[''] before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-b before:from-white/20 before:to-white/5
                  before:pointer-events-none
                "
              >
                <span className="relative z-10">Get Started</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="
                  text-lg px-10 py-6 rounded-full font-semibold
                  glass border-2 border-white/[0.15]
                  hover:bg-white/[0.12] hover:border-white/[0.25] hover:scale-[1.02]
                  transition-glass
                "
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-16 bg-border-glass/30" />

        {/* Footer Links with glass cards */}
        <div className="grid md:grid-cols-4 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="glass-sm p-6 rounded-2xl">
            <h3 className="font-bold text-foreground mb-5 text-lg">Shop</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-smooth">
                  Browse Brands
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-smooth">
                  Featured Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-smooth">
                  Deals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-smooth">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          <div className="glass-sm p-6 rounded-2xl">
            <h3 className="font-bold text-foreground mb-5 text-lg">For Brands</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-accent hover:translate-x-1 inline-block transition-smooth">
                  Join Platform
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent hover:translate-x-1 inline-block transition-smooth">
                  Brand Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent hover:translate-x-1 inline-block transition-smooth">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent hover:translate-x-1 inline-block transition-smooth">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="glass-sm p-6 rounded-2xl">
            <h3 className="font-bold text-foreground mb-5 text-lg">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-smooth">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-smooth">
                  Delivery Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-smooth">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-smooth">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="glass-sm p-6 rounded-2xl">
            <h3 className="font-bold text-foreground mb-5 text-lg">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-golden hover:translate-x-1 inline-block transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-golden hover:translate-x-1 inline-block transition-smooth">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-golden hover:translate-x-1 inline-block transition-smooth">
                  Compliance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-golden hover:translate-x-1 inline-block transition-smooth">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-10 bg-border-glass/30" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground space-y-3">
          <p className="text-base">
            © 2025 TD Studios. All rights reserved.
          </p>
          <p className="text-xs text-gradient-holographic font-medium">
            Luxury digital experiences for modern brands.
          </p>
        </div>
      </div>
    </footer>
  );
}
