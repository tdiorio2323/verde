import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type AgeVerificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AgeVerificationModal = ({ open, onOpenChange }: AgeVerificationModalProps) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!confirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that you are 21 years or older.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await updateProfile({ ageVerified: true });

    if (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to update age verification. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Age Verified",
      description: "Welcome to Verde Cannabis Marketplace!",
    });

    setLoading(false);
    onOpenChange(false);
  };

  const handleDecline = () => {
    toast({
      title: "Access Denied",
      description: "You must be 21 or older to access this marketplace.",
      variant: "destructive",
    });

    // Optionally redirect or show alternative content
    window.location.href = "/";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="liquid-glass border-white/15 bg-black/70 text-white sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-amber-500/20 p-4">
              <ShieldCheck className="h-12 w-12 text-amber-300" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent">
            Age Verification Required
          </DialogTitle>
          <DialogDescription className="text-white/80 text-center">
            Cannabis products are for adults 21 years and older only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="glass-md rounded-2xl p-4 space-y-3 text-sm text-white/70">
            <p className="font-semibold text-white/90">Legal Requirements:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>You must be at least 21 years old</li>
              <li>Valid government-issued ID will be verified at delivery</li>
              <li>Delivery to California addresses only</li>
              <li>Compliance with state cannabis regulations is mandatory</li>
            </ul>
          </div>

          <div className="flex items-start space-x-3 glass-sm rounded-xl p-4">
            <Checkbox
              id="age-confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              className="mt-1 border-white/30 data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-400"
            />
            <Label
              htmlFor="age-confirm"
              className="text-sm text-white/90 cursor-pointer leading-relaxed"
            >
              I confirm that I am 21 years of age or older and agree to verify my identity at the
              time of delivery.
            </Label>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirm}
              disabled={!confirmed || loading}
              className="btn-holographic w-full"
            >
              {loading ? "Verifying..." : "Confirm & Continue"}
            </Button>
            <Button
              onClick={handleDecline}
              disabled={loading}
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-white/10"
            >
              I'm Under 21
            </Button>
          </div>

          <p className="text-xs text-white/60 text-center">
            By continuing, you acknowledge that you have read and agree to Verde's{" "}
            <a href="#" className="text-amber-300 hover:text-amber-200 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-amber-300 hover:text-amber-200 underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
