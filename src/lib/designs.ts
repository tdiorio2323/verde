import { supabase } from "@/shared/lib/supabaseClient";

const DESIGNS_BUCKET = "designs";

export type DesignAsset = {
  id: string | null;
  name: string;
  path: string;
  publicUrl: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastAccessedAt: string | null;
  size: number | null;
  mimeType: string | null;
};

type StorageObject = {
  id: string | null;
  name: string;
  created_at: string | null;
  updated_at: string | null;
  last_accessed_at: string | null;
  metadata: null | {
    size?: number | string;
    mimetype?: string;
    cacheControl?: string;
    [key: string]: unknown;
  };
};

const normalizeSize = (value: number | string | undefined): number | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeMime = (metadata: StorageObject["metadata"]): string | null => {
  if (!metadata) {
    return null;
  }

  if (typeof metadata.mimetype === "string") {
    return metadata.mimetype;
  }

  const contentType = metadata["contentType"];
  return typeof contentType === "string" ? contentType : null;
};

const getFileUrl = async (path: string): Promise<string> => {
  const { data } = supabase.storage.from(DESIGNS_BUCKET).getPublicUrl(path);

  if (data?.publicUrl) {
    return data.publicUrl;
  }

  const { data: signedData } = await supabase.storage
    .from(DESIGNS_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24);

  return signedData?.signedUrl ?? "";
};

const listRecursive = async (path = ""): Promise<DesignAsset[]> => {
  const allAssets: DesignAsset[] = [];
  let offset = 0;
  const BATCH_SIZE = 100; // Process in batches to handle large directories
  
  console.log(`=== DEBUG: Starting listRecursive for path: "${path}" ===`);
  
  while (true) {
    console.log(`Fetching batch: offset=${offset}, limit=${BATCH_SIZE}`);
    
    const { data, error } = await supabase.storage.from(DESIGNS_BUCKET).list(path, {
      limit: BATCH_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.error("Storage list error:", error);
      throw error;
    }

    console.log(`Batch response: ${data?.length || 0} items received`);

    if (!data || data.length === 0) {
      break; // No more items
    }

    const batchResults = await Promise.all(
      data.map(async (item: StorageObject) => {
        const currentPath = path ? `${path}/${item.name}` : item.name;

        // Folders return metadata as null; recurse into them
        if (!item.metadata) {
          return listRecursive(currentPath);
        }

        const publicUrl = await getFileUrl(currentPath);

        const asset: DesignAsset = {
          id: item.id,
          name: item.name,
          path: currentPath,
          publicUrl,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          lastAccessedAt: item.last_accessed_at,
          size: normalizeSize(item.metadata.size),
          mimeType: normalizeMime(item.metadata),
        };

        return [asset];
      })
    );

    allAssets.push(...batchResults.flat());

    // If we got fewer items than the batch size, we've reached the end
    if (data.length < BATCH_SIZE) {
      break;
    }

    offset += BATCH_SIZE;
  }

  return allAssets;
};

export const fetchDesignAssets = async (): Promise<DesignAsset[]> => {
  try {
    console.log("=== DEBUG: Fetching design assets ===");
    console.log("DESIGNS_BUCKET:", DESIGNS_BUCKET);
    console.log("Environment check - import.meta.env.VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Environment check - import.meta.env.VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "✓ Present" : "✗ Missing");
    
    const assets = await listRecursive();
    console.log("Successfully fetched", assets.length, "design assets");
    return assets;
  } catch (error) {
    console.error("Error fetching design assets:", error);
    throw error;
  }
};

export const isImageAsset = (asset: DesignAsset): boolean => {
  if (asset.mimeType && asset.mimeType.startsWith("image/")) {
    return true;
  }

  return /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(asset.path);
};

// Replace with your WhatsApp number (country code + number, no spaces)
const phoneNumber = "1234567890"; // Example: "1234567890" for +1 (234) 567-8901

// Replace with your Telegram username (without @)  
const telegramUsername = "yourusername"; // Example: "tdiorio" for @tdiorio
