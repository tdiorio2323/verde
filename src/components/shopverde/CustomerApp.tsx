import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Star, Heart, Filter, Search, User, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/shared/lib/supabaseClient';
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

interface CartItem extends Product {
  quantity: number;
}

interface CustomerAppProps {
  onCheckout?: (items: CartItem[], total: number) => void;
}

// Mock products for display
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

const CustomerApp = ({ onCheckout }: CustomerAppProps) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Merge database products with mock products, or use mock if no database products
      const dbProducts = data || [];
      if (dbProducts.length > 0) {
        setProducts([...mockProducts, ...dbProducts]);
      }
      // If no database products, mockProducts are already set as initial state
    } catch (error) {
      console.error('Error fetching products:', error);
      // Keep mock products on error - don't show error toast in mock mode
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = [...new Set(products.map(product => product.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-white/80">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-8">
            {/* Top row with centered logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/verde-logo.webp"
                alt="Verde"
                className="h-64 w-auto"
              />
            </div>

            {/* Bottom row with cart button */}
            <div className="flex items-center justify-center relative">
              <div className="absolute right-0">
                <Button
                  variant="outline"
                  size="lg"
                  className="relative bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => {
                    if (cart.length > 0 && onCheckout) {
                      onCheckout(cart, cartTotal);
                    } else if (cart.length > 0) {
                      // Store cart data and navigate to checkout
                      sessionStorage.setItem('cartItems', JSON.stringify(cart));
                      sessionStorage.setItem('cartTotal', cartTotal.toString());
                      navigate('/checkout');
                    } else {
                      toast.info('Add items to cart first!');
                    }
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({cart.length})
                  {cart.length > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">
                      ${(cartTotal / 100).toFixed(2)}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category || ''}>
                      {category ? category.charAt(0).toUpperCase() + category.slice(1).replaceAll('_', ' ') : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/productverde/${product.id}`)}
              >
                <CardContent className="p-6">
                  <div className="aspect-square mb-4 bg-white/5 rounded-lg overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-2xl">🌿</span>
                          </div>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                      <Badge variant="secondary" className="mt-1 bg-white/20 text-white/80">
                        {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1).replaceAll('_', ' ') : ''}
                      </Badge>
                    </div>

                    {product.description && (
                      <p className="text-white/70 text-sm line-clamp-2">{product.description}</p>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-white">${(product.price / 100).toFixed(2)}</span>
                        {product.stock_quantity && (
                          <span className="text-white/60 text-sm ml-2">Stock: {product.stock_quantity}</span>
                        )}
                      </div>
                    </div>


                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                        className="border-white/20 text-white/80 hover:bg-white/20"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 text-xl mb-4">No products found</div>
              <p className="text-white/40">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <img
                  src="/verde-logo.webp"
                  alt="Verde"
                  className="h-16 w-auto"
                />
                <p className="text-white/60 text-sm">
                  Premium Verde delivery service bringing you the finest botanical products right to your door.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Follow @verde</h3>
                <div className="flex gap-3">
                  <div className="bg-white/10 rounded-lg w-24 h-24 overflow-hidden p-2">
                    <img src="/verde-logo.png" alt="Verde" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-white/10 rounded-lg w-24 h-24 overflow-hidden p-2">
                    <img src="/verde-logo.png" alt="Verde" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-white/10 rounded-lg w-24 h-24 overflow-hidden p-2">
                    <img src="/verde-logo.png" alt="Verde" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-white/10 rounded-lg w-24 h-24 overflow-hidden p-2">
                    <img src="/verde-logo.png" alt="Verde" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <p className="text-white/60 text-sm">
                © 2024 Verde. All rights reserved. Please consume responsibly.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CustomerApp;
