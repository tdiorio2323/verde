/**
 * Filtering and sorting utilities for collections.
 * Provides reusable filter functions for products, orders, and other entities.
 */

import type { Product } from "@/data/products";
import type { CustomerOrder } from "@/data/orders";
import type { SortOption } from "@/shared/types/app";

// ========================================
// PRODUCT FILTERS
// ========================================

/**
 * Filter products by category
 */
export function filterByCategory(products: Product[], categoryId: string): Product[] {
  if (categoryId === "all") {
    return products;
  }
  return products.filter((product) => product.category === categoryId);
}

/**
 * Filter products by search query
 * Searches in product name and description (case-insensitive)
 */
export function filterBySearch(products: Product[], searchQuery: string): Product[] {
  if (!searchQuery.trim()) {
    return products;
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
    const descMatch = product.description.toLowerCase().includes(normalizedQuery);
    return nameMatch || descMatch;
  });
}

/**
 * Filter products by dispensary ID
 */
export function filterByDispensary(
  products: Product[],
  dispensaryId: string | null
): Product[] {
  if (!dispensaryId) {
    return products;
  }

  return products.filter((product) => {
    // If product has no dispensaryId field, include it (global products)
    if (!("dispensaryId" in product)) {
      return true;
    }
    return product.dispensaryId === dispensaryId;
  });
}

/**
 * Sort products by a given sort option
 */
export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const sorted = [...products];

  switch (sortOption) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);

    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);

    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "featured":
    default:
      // Featured items typically have a 'featured' flag or higher rating
      return sorted.sort((a, b) => {
        // Prioritize by rating, then by name
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return a.name.localeCompare(b.name);
      });
  }
}

// ========================================
// ORDER FILTERS
// ========================================

/**
 * Filter orders by status
 */
export function filterOrdersByStatus<T extends { status: string }>(
  orders: T[],
  status: string
): T[] {
  if (status === "all") {
    return orders;
  }
  return orders.filter((order) => order.status === status);
}

/**
 * Filter orders by date range
 */
export function filterOrdersByDateRange(
  orders: CustomerOrder[],
  startDate: Date,
  endDate: Date
): CustomerOrder[] {
  return orders.filter((order) => {
    const orderDate = new Date(order.placedAt);
    return orderDate >= startDate && orderDate <= endDate;
  });
}

// ========================================
// GENERIC FILTERS
// ========================================

/**
 * Filter items by a predicate function
 * Generic utility for custom filtering
 */
export function filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

/**
 * Remove duplicates from an array based on a key selector
 */
export function uniqueBy<T>(items: T[], keySelector: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Partition an array into two arrays based on a predicate
 * @returns Tuple of [itemsThatMatch, itemsThatDontMatch]
 */
export function partition<T>(
  items: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const matches: T[] = [];
  const nonMatches: T[] = [];

  for (const item of items) {
    if (predicate(item)) {
      matches.push(item);
    } else {
      nonMatches.push(item);
    }
  }

  return [matches, nonMatches];
}
