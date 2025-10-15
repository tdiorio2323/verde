import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import GlassCard from "@/components/ui/GlassCard";
import Img from "@/components/ui/Img";

export default function Hero() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic stub validation - check if code is entered
    if (code && code.length === 6) {
      // In production, validate against backend
      navigate("/dashboard");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Layered Background with Parallax Effect */}
      <div className="absolute inset-0">
        {/* Base Image Layer */}
        <div className="absolute inset-0 scale-105">
          <Img
            src="/images/twitter-image-short.jpg"
            alt="TD Studios building exterior"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Floating Logo with Premium Breathing Animation */}
      <div className="relative z-10 flex items-center justify-center pt-[10vh] pb-[6vh]">
        <div className="relative">
          {/* Glow Background Layer */}
          <div className="absolute inset-0 blur-3xl opacity-40" aria-hidden="true">
            <div className="w-full h-full rounded-full" style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)'
            }} />
          </div>

          {/* Logo with Enhanced Drop Shadow */}
          <Img
            src="/images/td-studios-logo.png"
            alt="TD Studios logo"
            className="relative h-64 md:h-80 w-auto drop-shadow-2xl animate-breathe metallic-glow"
            style={{
              filter: 'var(--drop-shadow-logo)'
            }}
            loading="eager"
          />
        </div>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-1"></div>

      {/* Access Code Interface - Cinematic Glass Morphism */}
      <div className="relative z-10 container mx-auto px-6 pb-[10vh] w-full">
        <div className="max-w-xl mx-auto">
          {/* Layered Glass Card with Depth */}
          <GlassCard variant="premium" glow className="shadow-glass-xl" aria-label="Private Access Form">
            <form onSubmit={handleSubmit} className="p-10 md:p-12 space-y-10">
              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-5xl font-bold text-gradient-holographic leading-tight">
                    Private Access
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground/90">
                    Exclusive access for creators, partners, and operators.
                  </p>
                </div>

                {/* Premium OTP Input with Enhanced Glass Styling */}
                <div className="flex justify-center py-6">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="gap-2"
                  >
                    <InputOTPGroup className="gap-3">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="
                            w-14 h-16 md:w-16 md:h-20 rounded-2xl text-2xl font-bold
                            bg-white/[0.08] backdrop-blur-3xl
                            border-2 border-white/[0.15]
                            focus:border-white/[0.4] focus:ring-4 focus:ring-white/30
                            shadow-glass-xl
                            text-foreground
                            transition-all duration-500
                            hover:bg-white/[0.12] hover:border-white/[0.25] hover:shadow-glow-sm
                            hover:scale-105
                            chrome-reflect
                          "
                          aria-label={`Access code digit ${index + 1}`}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Chrome Silver Metallic Button */}
              <div className="relative">
                {/* Button Glow Background */}
                <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-smooth" style={{
                  background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                }} />

                <Button
                  type="submit"
                  size="lg"
                  disabled={code.length !== 6}
                  className="
                    relative w-full rounded-full px-8 py-7 text-lg md:text-xl font-bold
                    text-background
                    border-2 border-white/30
                    shadow-glow
                    hover:shadow-glow hover:scale-[1.02] hover:border-white/40
                    active:scale-[0.98]
                    transition-all duration-500
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                    before:content-[''] before:absolute before:inset-0 before:rounded-full
                    before:bg-gradient-to-b before:from-white/30 before:via-white/15 before:to-transparent
                    before:pointer-events-none
                    overflow-hidden
                    btn-holographic
                  "
                  aria-label="Submit access code and enter platform"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Access Platform
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </div>
            </form>
          </GlassCard>

          {/* Subtle Branding */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
              POWERED BY TD STUDIOS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
