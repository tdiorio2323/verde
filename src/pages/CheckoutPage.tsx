
import { Link } from "react-router-dom";
import { useCart } from "@/features/cart/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CASHTAG = "$tdiorio23";

export default function CheckoutPage() {
  const { totalCents, clear } = useCart();
  const { toast } = useToast();
  const total = (totalCents() / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=https://cash.app/${CASHTAG}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(CASHTAG);
    toast({
      title: "Copied to clipboard",
      description: `${CASHTAG} has been copied to your clipboard.`,
    });
  };

  return (
    <main className="relative min-h-screen text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/20 via-purple-950/30 to-amber-950/20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 mx-auto max-w-md px-4 py-12 sm:px-6">
        {/* Back button */}
        <Link to="/cart" className="inline-flex items-center text-white/60 hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="bg-gradient-to-r from-sky-300 via-purple-300 to-amber-200 bg-clip-text text-3xl sm:text-4xl font-bold text-transparent mb-8">
          Checkout
        </h1>

        <Card className="glass-card border-white/15 bg-black/40 text-white">
          <CardHeader>
            <CardTitle>Pay with Cash App</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <img src={qrCodeUrl} alt="Cash App QR Code" className="rounded-lg mb-6" />
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{CASHTAG}</p>
              <Button onClick={handleCopy} variant="ghost" size="icon">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-white/60 mt-2">Scan the QR code or copy the cashtag to pay.</p>
            <p className="text-xs text-white/40 mt-4">This is not a real payment integration. For demonstration purposes only.</p>
            <p className="text-2xl font-bold mt-6">Total: {total}</p>
            <Button onClick={clear} variant="outline" className="mt-8 border-white/20 hover:bg-white/10">
              Clear Cart & Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
