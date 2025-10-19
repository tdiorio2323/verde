import { FormEvent, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CheckoutPayload } from "@/shared/types/app";
import {
  validateName,
  validatePhone,
  validateAddress,
  hasErrors as checkHasErrors,
} from "@/shared/lib/validation";

// Shared className constants for consistent styling
const GLASS_INPUT_CLASSES =
  "h-12 rounded-2xl border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/40";

const GLASS_TEXTAREA_CLASSES =
  "rounded-2xl border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/40";

const LABEL_CLASSES = "text-xs uppercase tracking-[0.28em] text-white/60";

const ERROR_TEXT_CLASSES = "text-xs text-amber-200";

export type CheckoutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: CheckoutPayload) => void;
  cartTotal: number;
};

const initialForm: CheckoutPayload = {
  customerName: "",
  phone: "",
  address: "",
  notes: "",
};

const CheckoutModal = ({ open, onOpenChange, onConfirm, cartTotal }: CheckoutModalProps) => {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState<Record<keyof CheckoutPayload, boolean>>({
    customerName: false,
    phone: false,
    address: false,
    notes: false,
  });

  const errors = useMemo(() => {
    return {
      customerName: validateName(form.customerName),
      phone: validatePhone(form.phone),
      address: validateAddress(form.address),
    };
  }, [form.customerName, form.phone, form.address]);

  const formHasErrors = checkHasErrors(errors);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ customerName: true, phone: true, address: true, notes: true });

    if (formHasErrors) {
      return;
    }

    onConfirm({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes?.trim() || "",
    });

    // Reset form state
    setForm(initialForm);
    setTouched({ customerName: false, phone: false, address: false, notes: false });
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(initialForm);
      setTouched({ customerName: false, phone: false, address: false, notes: false });
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg rounded-3xl border border-white/15 bg-[#070910]/95 p-0 text-white shadow-glass-xl">
        <DialogHeader className="space-y-2 px-6 pt-6 text-left">
          <DialogTitle className="text-2xl font-semibold">Finalize drop-off</DialogTitle>
          <DialogDescription className="text-sm text-white/70">
            Enter contact info and delivery notes. Verde concierge will confirm before dispatch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="space-y-1">
            <Label htmlFor="checkout-name" className={LABEL_CLASSES}>
              Contact name
            </Label>
            <Input
              id="checkout-name"
              value={form.customerName}
              onChange={(event) => setForm({ ...form, customerName: event.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, customerName: true }))}
              className={GLASS_INPUT_CLASSES}
              placeholder="Jordan Blake"
            />
            {touched.customerName && errors.customerName && (
              <p className={ERROR_TEXT_CLASSES}>{errors.customerName}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-phone" className={LABEL_CLASSES}>
              Mobile number
            </Label>
            <Input
              id="checkout-phone"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
              inputMode="tel"
              className={GLASS_INPUT_CLASSES}
              placeholder="310-555-0198"
            />
            {touched.phone && errors.phone && (
              <p className={ERROR_TEXT_CLASSES}>{errors.phone}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-address" className={LABEL_CLASSES}>
              Delivery address
            </Label>
            <Textarea
              id="checkout-address"
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, address: true }))}
              className={`${GLASS_TEXTAREA_CLASSES} min-h-[100px]`}
              placeholder="525 Luxe Tower, Unit 3204, Los Angeles, CA"
            />
            {touched.address && errors.address && (
              <p className={ERROR_TEXT_CLASSES}>{errors.address}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-notes" className={LABEL_CLASSES}>
              Concierge notes (optional)
            </Label>
            <Textarea
              id="checkout-notes"
              value={form.notes ?? ""}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className={`${GLASS_TEXTAREA_CLASSES} min-h-[80px]`}
              placeholder="Gate code, valet details, or delivery preferences"
            />
          </div>

          <DialogFooter className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="h-12 rounded-full border border-white/30 bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-200 text-base font-semibold text-background shadow-glow transition-transform hover:scale-[1.01]"
              disabled={formHasErrors && Object.values(touched).some(Boolean)}
            >
              Place order • ${cartTotal.toFixed(2)}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleClose(false)}
              className="h-11 rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white/70 hover:text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
