import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart, Star, Share2, Package, Shield, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  category: string | null;
  is_active: boolean | null;
  stock_quantity: number | null;
  brand_id: string | null;
  created_at: string;
  updated_at: string;
}

// Mock products (same as CustomerApp)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Herbal Blend',
    price: 4999,
    description: 'Our signature blend of premium herbs for the ultimate experience',
    image_url: '/verde-logo.webp',
    category: 'premium',
    is_active: true,
    stock_quantity: 50,
    brand_id: 'verde',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Exotic Flower Collection',
    price: 5999,
    description: 'Rare and exotic flowers from around the world',
    image_url: '/verde-logo.webp',
    category: 'premium',
    is_active: true,
    stock_quantity: 30,
    brand_id: 'verde',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Artisan Rolling Papers',
    price: 1299,
    description: 'Handcrafted rolling papers made from organic materials',
    image_url: '/verde-logo.webp',
    category: 'accessories',
    is_active: true,
    stock_quantity: 100,
    brand_id: 'verde',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Luxury Glass Set',
    price: 8999,
    description: 'Premium handblown glass pieces for the connoisseur',
    image_url: '/verde-logo.webp',
    category: 'accessories',
    is_active: true,
    stock_quantity: 15,
    brand_id: 'verde',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Organic CBD Tincture',
    price: 3999,
    description: 'Pure organic CBD oil for relaxation and wellness',
    image_url: '/verde-logo.webp',
    category: 'wellness',
    is_active: true,
    stock_quantity: 75,
    brand_id: 'verde',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Designer Storage Case',
    price: 6499,
    description: 'Elegant storage solution with airtight seal',
    image_url: '/verde-logo.webp',
    category: 'accessories',
    is_active: true,
    stock_quantity: 40,
    brand_id: 'verde',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Botanical Grinder',
    price: 2499,
    description: 'Precision-engineered grinder for perfect consistency',
    image_url: '/verde-logo.webp',
    category: 'accessories',
    is_active: true,
    stock_quantity: 60,
    brand_id: 'verde',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Deluxe Starter Kit',
    price: 12999,
    description: 'Everything you need to get started in one premium package',
    image_url: '/verde-logo.webp',
    category: 'bundles',
    is_active: true,
    stock_quantity: 25,
    brand_id: 'verde',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const ProductDetailVerde = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find product by ID
    const foundProduct = mockProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setIsLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Get existing cart from sessionStorage
      const existingCart = sessionStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];

      // Add or update product in cart
      const existingItem = cart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }

      sessionStorage.setItem('cart', JSON.stringify(cart));
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-white/80">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/shopverde')} variant="outline" className="border-white/20 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-6">
            {/* Logo centered at top */}
            <img
              src="/verde-logo.webp"
              alt="Verde"
              className="h-64 w-auto"
            />

            {/* Navigation buttons below logo */}
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                onClick={() => navigate('/shopverde')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/checkout')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/5">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <Package className="h-32 w-32" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery - Placeholder for future images */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-white/5 border-2 border-white/10 hover:border-white/30 transition-colors cursor-pointer overflow-hidden">
                  <img src="/verde-logo.png" alt="Preview" className="w-full h-full object-contain p-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 bg-white/20 text-white">
                {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1).replaceAll('_', ' ') : 'Product'}
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-white/60 text-sm">(24 reviews)</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-white">
              ${(product.price / 100).toFixed(2)}
            </div>

            <p className="text-white/70 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Additional product details - Editable by user later */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-white/80">
                <Package className="h-5 w-5" />
                <span>In Stock: {product.stock_quantity} units available</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Truck className="h-5 w-5" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Shield className="h-5 w-5" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-white font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-white font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-white/20 text-white hover:bg-white/20 h-auto w-14"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-white/20 text-white hover:bg-white/20 h-auto w-14"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4 text-white/80 mt-6">
                <h3 className="text-xl font-semibold text-white">Product Description</h3>
                <p>{product.description}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Edit this section with your detailed product information.</p>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-4 text-white/80 mt-6">
                <h3 className="text-xl font-semibold text-white">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-white">Category:</span> {product.category}
                  </div>
                  <div>
                    <span className="font-medium text-white">Brand:</span> {product.brand_id}
                  </div>
                  <div>
                    <span className="font-medium text-white">SKU:</span> {product.id}
                  </div>
                  <div>
                    <span className="font-medium text-white">Stock:</span> {product.stock_quantity}
                  </div>
                </div>
                <p className="pt-4">Add more specifications here as needed.</p>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 text-white/80 mt-6">
                <h3 className="text-xl font-semibold text-white">Customer Reviews</h3>
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <span className="font-medium text-white">Amazing product!</span>
                    </div>
                    <p>Add customer reviews here. You can edit this section later with real reviews.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Verde. All rights reserved. Please consume responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailVerde;
