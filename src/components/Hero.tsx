import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

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
      {/* Full-Screen Background with enhanced overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/twitter-image-short.jpg"
          alt="TD Studios"
          className="w-full h-full object-cover"
        />
        {/* Luxury dark gradient overlay with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-glass" />
      </div>

      {/* Logo at top with floating animation and premium glow */}
      <div className="relative z-10 flex items-center justify-center pt-[12vh] pb-[8vh]">
        <div className="relative">
          <img
            src="/images/td-studios-logo.png"
            alt="TD Studios"
            className="h-72 w-auto drop-shadow-2xl animate-float"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.3))'
            }}
          />
        </div>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-1"></div>

      {/* Access Code Interface - luxury glass morphism card */}
      <div className="relative z-10 container mx-auto px-6 pb-[12vh] w-full">
        <div className="max-w-lg mx-auto">
          {/* Glass morphism container */}
          <div className="glass-card p-8 rounded-3xl shadow-glass-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-gradient-holographic">
                    Enter Access Code
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your 6-digit code to access the platform
                  </p>
                </div>

                {/* OTP Input with enhanced glass styling */}
                <div className="flex justify-center py-4">
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
                            w-16 h-16 rounded-2xl text-xl font-bold
                            bg-white/[0.08] backdrop-blur-xl
                            border-2 border-white/[0.15]
                            focus:border-primary-light focus:ring-2 focus:ring-primary/40
                            shadow-glass
                            text-foreground
                            transition-glass
                            hover:bg-white/[0.12] hover:border-white/[0.25]
                          "
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Premium holographic button */}
              <Button
                type="submit"
                size="lg"
                disabled={code.length !== 6}
                className="
                  w-full relative rounded-full px-8 py-6 text-lg font-bold
                  text-foreground
                  bg-gradient-holographic
                  border border-white/20
                  shadow-glow
                  hover:shadow-golden hover:scale-[1.02]
                  transition-smooth
                  before:content-[''] before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-b before:from-white/20 before:to-white/5
                  before:pointer-events-none
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                "
              >
                <span className="relative z-10">Access Platform</span>
              </Button>
            </form>
          </div>

          {/* Decorative elements */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by TD Studios
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}