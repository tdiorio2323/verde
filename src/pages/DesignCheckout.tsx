import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, MessageCircle, Send } from "lucide-react";

import { useDesignCartStore } from "@/stores/designCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CustomerInfo {
  name: string;
  instagram: string;
  phone: string;
  email: string;
  notes: string;
}

const DesignCheckout = () => {
  const { items, removeItem, clearCart, getItemCount } = useDesignCartStore();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    instagram: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatWhatsAppMessage = () => {
    const designList = items
      .map((item, index) => `${index + 1}. ${item.asset.name}`)
      .join('\n');

    return `🎨 *New Design Order Request*

*Customer Details:*
Name: ${customerInfo.name}
Instagram: ${customerInfo.instagram ? '@' + customerInfo.instagram : 'Not provided'}
Phone: ${customerInfo.phone || 'Not provided'}
Email: ${customerInfo.email || 'Not provided'}

*Designs Requested (${items.length} total):*
${designList}

${customerInfo.notes ? `*Additional Notes:*\n${customerInfo.notes}` : ''}

Please confirm availability and pricing. Thank you! 🙏`;
  };

  const formatTelegramMessage = () => {
    const designList = items
      .map((item, index) => `${index + 1}. ${item.asset.name}`)
      .join('\n');

    return `🎨 <b>New Design Order Request</b>

<b>Customer Details:</b>
Name: ${customerInfo.name}
Instagram: ${customerInfo.instagram ? '@' + customerInfo.instagram : 'Not provided'}
Phone: ${customerInfo.phone || 'Not provided'}  
Email: ${customerInfo.email || 'Not provided'}

<b>Designs Requested (${items.length} total):</b>
${designList}

${customerInfo.notes ? `<b>Additional Notes:</b>\n${customerInfo.notes}` : ''}

Please confirm availability and pricing. Thank you! 🙏`;
  };

  const sendWhatsAppMessage = () => {
    const message = formatWhatsAppMessage();
    // Your WhatsApp number: +1 (347) 485-9935
    const phoneNumber = "13474859935"; // WhatsApp format: country code + number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendTelegramMessage = () => {
    const message = formatTelegramMessage();
    // TODO: Replace with your actual Telegram username (without @)
    const telegramUsername = "yourusername"; // Example: "tdiorio" for @tdiorio
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/${telegramUsername}?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
  };

  const handleSubmit = async (platform: 'whatsapp' | 'telegram') => {
    if (!customerInfo.name || (!customerInfo.instagram && !customerInfo.phone && !customerInfo.email)) {
      alert('Please provide your name and at least one contact method (Instagram, phone, or email).');
      return;
    }

    setIsSubmitting(true);

    try {
      if (platform === 'whatsapp') {
        sendWhatsAppMessage();
      } else {
        sendTelegramMessage();
      }

      setOrderSent(true);
      clearCart();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('There was an error sending your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Order Sent Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your design request has been sent. I'll get back to you shortly with availability and pricing.
            </p>
            <Button asChild className="w-full">
              <Link to="/designs">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className="container mx-auto flex items-center gap-4 px-6 py-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/designs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Designs
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Checkout</h1>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some designs to your cart to place an order.
            </p>
            <Button asChild>
              <Link to="/designs">Browse Designs</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="container mx-auto flex items-center gap-4 px-6 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/designs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Designs
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Checkout ({getItemCount()} items)</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Selected Designs */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Selected Designs</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.asset.path}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={item.asset.publicUrl}
                          alt={item.asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.asset.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.asset.path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <Alert>
                  <AlertDescription>
                    Please provide at least one contact method below so I can reach you about your order.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="instagram">Instagram Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                    <Input
                      id="instagram"
                      value={customerInfo.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="yourusername"
                      className="pl-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any specific requirements, deadlines, or questions..."
                    rows={3}
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Choose how you'd like to send your order:
                  </p>
                  
                  <Button
                    onClick={() => handleSubmit('whatsapp')}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send via WhatsApp
                  </Button>

                  <Button
                    onClick={() => handleSubmit('telegram')}
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send via Telegram
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Your order will be sent as a message with all the design details and your contact information. 
                  I'll respond with pricing and payment instructions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DesignCheckout;