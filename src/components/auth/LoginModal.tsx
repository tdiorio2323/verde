import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const { signInWithOtp, verifyOtp } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const phoneToE164 = (formattedPhone: string) => {
    const cleaned = formattedPhone.replace(/\D/g, "");
    return `+1${cleaned}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const e164Phone = phoneToE164(phone);
    const { error } = await signInWithOtp(e164Phone);

    if (error) {
      toast({
        title: "Error Sending Code",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Code Sent",
      description: "Check your phone for a 6-digit verification code.",
    });

    setStep("otp");
    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const e164Phone = phoneToE164(phone);
    const { error } = await verifyOtp(e164Phone, otp);

    if (error) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Welcome to Verde",
      description: "Successfully signed in!",
    });

    // Reset state and close modal
    setStep("phone");
    setPhone("");
    setOtp("");
    setLoading(false);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("phone");
    setOtp("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="liquid-glass border-white/15 bg-black/60 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-transparent">
            {step === "phone" ? "Sign In to Verde" : "Enter Verification Code"}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {step === "phone"
              ? "Enter your phone number to receive a verification code"
              : `We sent a 6-digit code to ${phone}`}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/90">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                maxLength={14}
                required
                className="glass border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-white/40"
              />
              <p className="text-xs text-white/60">
                US phone numbers only. Standard SMS rates may apply.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || phone.replace(/\D/g, "").length !== 10}
              className="btn-holographic w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="otp" className="text-white/90 text-center block">
                Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={loading}>
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="glass border-white/20 bg-white/5 text-white"
                    />
                    <InputOTPSlot
                      index={1}
                      className="glass border-white/20 bg-white/5 text-white"
                    />
                    <InputOTPSlot
                      index={2}
                      className="glass border-white/20 bg-white/5 text-white"
                    />
                    <InputOTPSlot
                      index={3}
                      className="glass border-white/20 bg-white/5 text-white"
                    />
                    <InputOTPSlot
                      index={4}
                      className="glass border-white/20 bg-white/5 text-white"
                    />
                    <InputOTPSlot
                      index={5}
                      className="glass border-white/20 bg-white/5 text-white"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-white/60 text-center">
                Didn't receive a code?{" "}
                <button
                  type="button"
                  onClick={handlePhoneSubmit}
                  disabled={loading}
                  className="text-sky-300 hover:text-sky-200 underline"
                >
                  Resend
                </button>
              </p>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-holographic w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleBack}
                disabled={loading}
                variant="ghost"
                className="w-full text-white/70 hover:text-white hover:bg-white/10"
              >
                Back
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
