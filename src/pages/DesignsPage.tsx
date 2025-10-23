import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Loader2, RefreshCcw, ShoppingCart, Check } from "lucide-react";

import { fetchDesignAssets, isImageAsset, type DesignAsset } from "@/lib/designs";
import { useDesignCartStore } from "@/stores/designCartStore";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { APP_ENV } from "@/shared/config/inspectEnv";

const formatFileSize = (bytes: number | null): string => {
  if (!bytes) {
    return "—";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exponent;
  return `${size.toFixed(size < 10 && exponent > 0 ? 1 : 0)} ${units[exponent]}`;
};

const watermarkOverlayStyle: CSSProperties = {
  pointerEvents: "none",
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(45deg, rgba(255, 255, 255, 0.6) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.6) 75%), linear-gradient(45deg, rgba(0, 0, 0, 0.4) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.4) 75%)",
  backgroundSize: "40px 40px",
  backgroundPosition: "0 0, 20px 20px",
  opacity: 0.7,
  mixBlendMode: "overlay",
};

const logoWatermarkStyle: CSSProperties = {
  pointerEvents: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "450px",
  opacity: 1,
  zIndex: 10,
};

const formatDate = (value: string | null): string => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const DesignsPage = () => {
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");
  
  const { addItem, removeItem, isInCart, getItemCount } = useDesignCartStore();

  const loadAssets = useCallback(async () => {
    console.log("loadAssets called");
    setIsLoading(true);
    setError(null);
    setDebugInfo("Starting to fetch design assets...");

    try {
      setDebugInfo("Calling fetchDesignAssets...");
      const data = await fetchDesignAssets();
      console.log("Received data:", data);
      setDebugInfo(`Received ${data.length} assets, sorting...`);

      const sorted = data.sort((a, b) => {
        const left = a.updatedAt ?? a.createdAt ?? "";
        const right = b.updatedAt ?? b.createdAt ?? "";

        if (!left && !right) {
          return a.name.localeCompare(b.name);
        }

        return new Date(right).getTime() - new Date(left).getTime();
      });

      const sanitized = sorted.filter((asset) => asset.name.toLowerCase() !== "blue-sashimi.pdf");

      if (sanitized.length !== sorted.length) {
        console.info("Filtered out deprecated asset blue-sashimi.pdf");
      }

      setAssets(sanitized);
      setDebugInfo(`Successfully loaded ${sanitized.length} assets`);
    } catch (err) {
      console.error("Failed to load designs", err);
      const errorMsg = err instanceof Error ? err.message : "Unable to load designs from Supabase.";
      setError(errorMsg);
      setDebugInfo(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  const assetCountLabel = useMemo(() => {
    if (isLoading) {
      return "Loading designs…";
    }

    if (!assets.length) {
      return "No designs found";
    }

    const cartCount = getItemCount();
    return `${assets.length} design${assets.length === 1 ? "" : "s"} available${cartCount > 0 ? ` • ${cartCount} in cart` : ""}`;
  }, [assets.length, isLoading, getItemCount]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="container mx-auto flex flex-col gap-3 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Design Library</h1>
            <p className="text-muted-foreground">
              Browse assets stored in the Supabase "designs" bucket for TD Studios projects.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Debug: {debugInfo}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{assetCountLabel}</span>
            
            {getItemCount() > 0 && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => window.location.href = '/designs/checkout'}
                className="bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Checkout ({getItemCount()})
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={() => void loadAssets()} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {error ? (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Unable to load designs</AlertTitle>
            <AlertDescription>
              {error} — double-check your Supabase credentials and bucket permissions.
            </AlertDescription>
          </Alert>
        ) : null}

        {assets.length === 0 && !isLoading ? (
          <div className="rounded-xl border border-border/60 bg-muted/20 px-6 py-12 text-center text-muted-foreground">
            No designs available yet. Upload assets to the Supabase bucket to populate this view.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => {
              const isImage = isImageAsset(asset);
              return (
                <article
                  key={asset.path}
                  className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition hover:border-border hover:shadow-md"
                >
                  <div className="relative bg-muted/40">
                    {isImage && asset.publicUrl ? (
                      <div className="relative">
                        <img
                          src={asset.publicUrl}
                          alt={asset.name}
                          className="w-full h-auto object-contain transition duration-300 group-hover:scale-[1.01]"
                          loading="lazy"
                        />
                        <div style={watermarkOverlayStyle} aria-hidden="true" />
                        <img
                          src="/verde-logo.png"
                          alt="Verde Watermark"
                          style={logoWatermarkStyle}
                          aria-hidden="true"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center text-sm text-muted-foreground">
                        Preview unavailable
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 border-t border-border/40 p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-medium leading-tight text-foreground">
                        {asset.name}
                      </h2>
                      
                      <div className="flex items-center gap-2">
                        {isInCart(asset.path) ? (
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => removeItem(asset.path)}
                            className="text-green-600"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Added
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => addItem(asset)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        )}
                        
                        {asset.publicUrl ? (
                          <Button size="sm" asChild variant="outline">
                            <Link to={asset.publicUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="mt-12 flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Fetching latest assets…
          </div>
        ) : null}
      </main>
      
      {/* Dev Environment Inspector - Only visible in development */}
      {APP_ENV.IS_DEV && (
        <footer className="mt-8 p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 space-y-2">
            <h4 className="font-semibold">Dev Environment Status</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="inline-block w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: APP_ENV.HAS_SUPABASE_URL ? '#10b981' : '#ef4444' }}></span>
                SUPABASE_URL: {APP_ENV.HAS_SUPABASE_URL ? 'Set' : 'Missing'}
              </div>
              <div>
                <span className="inline-block w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: APP_ENV.HAS_SUPABASE_ANON ? '#10b981' : '#ef4444' }}></span>
                SUPABASE_ANON_KEY: {APP_ENV.HAS_SUPABASE_ANON ? 'Set' : 'Missing'}
              </div>
              <div>
                <span className="inline-block w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: '#3b82f6' }}></span>
                Environment: {APP_ENV.NODE_ENV}
              </div>
              <div>
                <span className="inline-block w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: APP_ENV.ROUTES_DEBUG ? '#f59e0b' : '#6b7280' }}></span>
                Routes Debug: {APP_ENV.ROUTES_DEBUG ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Check console for window.__APP_ENV object
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default DesignsPage;
