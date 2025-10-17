import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBar from "@/components/dashboard/SearchBar";
import CategoryChips from "@/components/dashboard/CategoryChips";
import Img from "@/components/ui/Img";
import { useAppStore, selectors, appActions, type SortOption } from "@/data/store";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "THC: High to Low", value: "thc-desc" },
];

export type ShopViewProps = {
  onOpenCart: () => void;
};

const ShopView = ({ onOpenCart }: ShopViewProps) => {
  const products = useAppStore(selectors.products);
  const categories = useAppStore(selectors.categories);
  const filters = useAppStore(selectors.filters);
  const dispensaries = useAppStore(selectors.dispensaries);
  const session = useAppStore(selectors.session);
  const cart = useAppStore(selectors.cart);
  const totals = useAppStore(selectors.cartTotals);
  const cartItems = cart.items;

  const selectedDispensary = useMemo(
    () => dispensaries.find((disp) => disp.id === session.selectedDispensaryId) ?? dispensaries[0],
    [dispensaries, session.selectedDispensaryId],
  );

  const chipOptions = useMemo(() => {
    return [{ id: "all", name: "All" }, ...categories];
  }, [categories]);

  // Extract only featuredCategories to minimize useMemo dependencies
  const featuredCategories = useMemo(
    () => selectedDispensary?.featuredCategories ?? [],
    [selectedDispensary?.featuredCategories],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const base = products.filter((product) => {
      const matchesCategory =
        filters.categoryId === "all" || product.category === filters.categoryId;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);
      const matchesDispensary =
        featuredCategories.length === 0 || featuredCategories.includes(product.category);
      return matchesCategory && matchesSearch && matchesDispensary;
    });

    const sorted = [...base];
    switch (filters.sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "thc-desc":
        sorted.sort((a, b) => (b.thc ?? 0) - (a.thc ?? 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [filters.categoryId, filters.search, filters.sort, products, featuredCategories]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  return (
    <section className="space-y-10 px-4 pb-20 pt-8 text-white sm:px-6">
      <div className="space-y-6">
        <div className="liquid-glass overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 shadow-glass-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Preferred lounge</p>
              <h2 className="text-3xl font-semibold text-white">
                {selectedDispensary?.name ?? "Verde partner"}
              </h2>
              <p className="text-sm text-white/70">
                {selectedDispensary?.vibe ?? "Concierge delivery experience across Los Angeles."}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-white/60">
                <Badge className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-white/70">
                  {selectedDispensary?.region}
                </Badge>
                <Badge className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-white/70">
                  {selectedDispensary?.etaRange[0]}-{selectedDispensary?.etaRange[1]} min ETA
                </Badge>
                <Badge className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-white/70">
                  {selectedDispensary?.distanceMinutes} min away
                </Badge>
              </div>
            </div>
            <div className="w-full max-w-sm space-y-3 rounded-3xl border border-white/15 bg-white/5 p-4 shadow-inner">
              <Select
                value={session.selectedDispensaryId}
                onValueChange={appActions.setSelectedDispensary}
              >
                <SelectTrigger className="h-12 rounded-full border-white/20 bg-black/40 text-sm text-white shadow-glass focus-visible:ring-2 focus-visible:ring-white/40">
                  <SelectValue placeholder="Choose lounge" />
                </SelectTrigger>
                <SelectContent className="rounded-3xl border border-white/15 bg-black/90 text-white shadow-glass-xl">
                  {dispensaries.map((dispensary) => (
                    <SelectItem key={dispensary.id} value={dispensary.id} className="text-sm">
                      <div className="space-y-1">
                        <p className="font-semibold text-white">{dispensary.name}</p>
                        <p className="text-xs text-white/60">{dispensary.region}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <SearchBar
                value={filters.search}
                onChange={appActions.setSearch}
                onReset={() => appActions.setSearch("")}
                placeholder="Search strains, gummies, or merch"
              />
              <Select
                value={filters.sort}
                onValueChange={(value) => appActions.setSort(value as SortOption)}
              >
                <SelectTrigger className="h-12 rounded-full border-white/20 bg-black/40 text-sm text-white shadow-glass focus-visible:ring-2 focus-visible:ring-white/40">
                  <SelectValue placeholder="Sort menu" />
                </SelectTrigger>
                <SelectContent className="rounded-3xl border border-white/15 bg-black/90 text-white shadow-glass-xl">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-sm">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <CategoryChips
            categories={chipOptions}
            activeId={filters.categoryId}
            onSelect={appActions.setCategory}
          />
          <div className="flex flex-wrap gap-2 text-xs">
            {(selectedDispensary?.featuredCategories ?? []).map((categoryId) => {
              const categoryName = categories.find((item) => item.id === categoryId)?.name;
              if (!categoryName) return null;
              return (
                <Badge
                  key={categoryId}
                  className="rounded-full border border-white/20 bg-gradient-to-r from-sky-400/30 via-purple-400/30 to-amber-200/30 px-3 py-1 text-white"
                >
                  Featured - {categoryName}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="liquid-glass relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-5 text-white shadow-glass-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-glow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                <p className="text-sm text-white/60 line-clamp-3">{product.description}</p>
              </div>
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-glass">
                <Img
                  src={product.image}
                  alt={`${product.name} product image`}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>{product.strain ?? "Curated"}</span>
              {product.thc && <span>{product.thc}% THC</span>}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">Starting at</p>
                <p className="text-2xl font-semibold text-gradient-chrome">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => appActions.addToCart(product.id)}
                className="rounded-full border border-white/30 bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 px-6 py-2 text-sm font-semibold text-background shadow-glow transition-transform hover:scale-105"
                aria-label={`Add ${product.name} to cart`}
              >
                Add to cart
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-3xl border border-white/15 bg-black/30 p-10 text-center text-white/70">
          <h3 className="text-xl font-semibold text-white">Menu refreshing</h3>
          <p className="mt-2 text-sm">
            We are curating a new drop for this filter set. Adjust search or category to explore
            additional collections.
          </p>
        </div>
      )}

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
          <button
            type="button"
            onClick={onOpenCart}
            className="group relative flex w-full max-w-md items-center justify-between gap-4 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/80 via-purple-400/70 to-amber-300/70 text-base font-bold text-background shadow-glass">
                {cartCount}
              </span>
              <span>View cart</span>
            </span>
            <span>${totals.total.toFixed(2)}</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default ShopView;
