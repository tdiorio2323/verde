import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background via-background/98 to-background border-t border-border-glass/30">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-glass pointer-events-none" />

      <div className="relative container mx-auto px-6 py-24">
        {/* Centered CTA Section with Premium Glass Card */}
        <div className="text-center mb-24 max-w-5xl mx-auto">
          <div className="relative group">
            {/* Outer Glow Layer */}
            <div className="absolute -inset-1 rounded-[2rem] opacity-10 blur-3xl group-hover:opacity-20 transition-smooth" style={{
              background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.2) 0%, transparent 70%)'
            }} />

            {/* Main Glass Container */}
            <div className="relative liquid-glass p-12 md:p-16 rounded-[2rem] shadow-glass-xl border-2 border-white/[0.15] backdrop-blur-3xl">
              {/* Inner Shine */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.12] via-transparent to-transparent pointer-events-none chrome-reflect" />

              {/* Logo with Breathing Animation */}
              <div className="relative flex justify-center mb-10">
                <div className="relative">
                  {/* Glow Background */}
                  <div className="absolute inset-0 blur-3xl opacity-30">
                    <div className="w-full h-full rounded-full" style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                    }} />
                  </div>

                  <img
                    src="/images/td-studios-logo.png"
                    alt="TD Studios"
                    className="relative h-24 md:h-32 w-auto animate-breathe metallic-glow"
                    style={{
                      filter: 'drop-shadow(0 4px 40px rgba(255, 255, 255, 0.2))'
                    }}
                  />
                </div>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-holographic leading-tight tracking-tight">
                Built for Brands. Designed to Scale.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground/90 mb-12 leading-relaxed max-w-3xl mx-auto">
                Premium digital infrastructure for modern dispensaries and creative brands.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <div className="relative inline-block">
                  {/* Button Glow Background */}
                  <div className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-smooth" style={{
                    background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                  }} />

                  <Button
                    size="lg"
                    className="
                      relative text-lg px-12 py-7 rounded-full font-bold
                      btn-holographic
                      text-background
                      border-2 border-white/30
                      shadow-glow hover:shadow-silver hover:scale-[1.02] hover:border-white/40
                      active:scale-[0.98]
                      transition-all duration-500
                      before:content-[''] before:absolute before:inset-0 before:rounded-full
                      before:bg-gradient-to-b before:from-white/30 before:via-white/15 before:to-transparent
                      before:pointer-events-none
                    "
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="
                    text-lg px-12 py-7 rounded-full font-semibold
                    glass border-2 border-white/[0.15]
                    hover:bg-white/[0.12] hover:border-white/[0.25] hover:scale-[1.02]
                    active:scale-[0.98]
                    transition-all duration-500
                  "
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-20 bg-border-glass/20" />

        {/* Simplified Footer Links - Elegant Grid */}
        <div className="grid md:grid-cols-4 gap-10 md:gap-12 mb-20 max-w-5xl mx-auto">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-foreground mb-6 text-base tracking-wide uppercase text-sm opacity-90">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Browse Brands
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Featured Products
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Deals
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-bold text-foreground mb-6 text-base tracking-wide uppercase text-sm opacity-90">For Brands</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Join Platform
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Brand Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-bold text-foreground mb-6 text-base tracking-wide uppercase text-sm opacity-90">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Delivery Info
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-bold text-foreground mb-6 text-base tracking-wide uppercase text-sm opacity-90">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Compliance
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-12 bg-border-glass/20" />

        {/* Elegant Copyright */}
        <div className="text-center space-y-4">
          <p className="text-base text-muted-foreground/80">
            © 2025 TD Studios. All rights reserved.
          </p>
          <p className="text-xs text-gradient-holographic font-medium tracking-wider">
            Power. Precision. Presentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
