import { supabase } from './supabase';

export async function listShopItems(tag?: string, q?: string) {
  const baseSel = 'id,kind,slug,title,description,price_cents,image_url,shop_item_tags(tag)';
  
  // Build query with conditional filters
  const queryBuilder = tag
    ? supabase
        .from('shop_items')
        .select(baseSel.replace('shop_item_tags(tag)', 'shop_item_tags!inner(tag)'))
        .in('shop_item_tags.tag', [tag])
    : supabase.from('shop_items').select(baseSel);
  
  // Apply search filter if provided
  const finalQuery = q 
    ? queryBuilder.ilike('title', `%${q}%`)
    : queryBuilder;
  
  return finalQuery.order('created_at', { ascending: false });
}

export async function getShopItem(slug: string) {
  return supabase
    .from('shop_items')
    .select('id,kind,slug,title,description,price_cents,image_url,shop_item_tags(tag)')
    .eq('slug', slug)
    .single();
}

