/**
 * Application-wide constants.
 * Centralizes magic numbers, strings, and configuration values for maintainability.
 */

// ========================================
// BREAKPOINTS
// ========================================

/** Mobile breakpoint in pixels (viewport widths below this are considered mobile) */
export const MOBILE_BREAKPOINT = 768;

/** Tablet breakpoint in pixels */
export const TABLET_BREAKPOINT = 1024;

/** Desktop breakpoint in pixels */
export const DESKTOP_BREAKPOINT = 1280;

// ========================================
// CART & ORDER LIMITS
// ========================================

/** Minimum quantity per cart item */
export const MIN_CART_QUANTITY = 0;

/** Maximum quantity per cart item */
export const MAX_CART_QUANTITY = 9;

/** Minimum order total for free delivery (in USD) */
export const FREE_DELIVERY_THRESHOLD = 150;

// ========================================
// ANIMATION DURATIONS (in milliseconds)
// ========================================

/** Standard transition duration */
export const TRANSITION_DURATION = 500;

/** Fast transition duration */
export const TRANSITION_DURATION_FAST = 300;

/** Slow transition duration */
export const TRANSITION_DURATION_SLOW = 700;

/** Default animation delay increment */
export const ANIMATION_DELAY_INCREMENT = 2000;

// ========================================
// TOAST CONFIGURATION
// ========================================

/** Maximum number of toasts that can be displayed simultaneously */
export const TOAST_LIMIT = 1;

/** Delay in milliseconds before a dismissed toast is removed from DOM */
export const TOAST_REMOVE_DELAY = 1000000;

// ========================================
// ORDER STATUSES
// ========================================

/** Valid order status values */
export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "preparing",
  "enroute",
  "arriving",
  "delivered",
] as const;

/** Type for order status */
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Human-readable labels for order statuses */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Order Placed",
  confirmed: "Dispensary Confirmed",
  preparing: "Curating Order",
  enroute: "Driver En Route",
  arriving: "Arriving",
  delivered: "Delivered",
};

// ========================================
// USER ROLES
// ========================================

/** Valid user role values */
export const USER_ROLES = ["customer", "driver", "admin"] as const;

/** Type for user role */
export type UserRole = (typeof USER_ROLES)[number];

// ========================================
// DRIVER ASSIGNMENT STATUSES
// ========================================

/** Valid driver assignment status values */
export const DRIVER_STATUSES = ["assigned", "accepted", "enroute", "arrived", "delivered"] as const;

/** Type for driver assignment status */
export type DriverStatus = (typeof DRIVER_STATUSES)[number];

// ========================================
// TAX & FEES
// ========================================

/** Default tax rate (as decimal, e.g., 0.095 = 9.5%) */
export const DEFAULT_TAX_RATE = 0.095;

/** Default service fee rate (as decimal, e.g., 0.08 = 8%) */
export const DEFAULT_SERVICE_RATE = 0.08;

/** Base delivery fee in USD (when order doesn't qualify for free delivery) */
export const BASE_DELIVERY_FEE = 9;

// ========================================
// TIMELINE CONFIGURATION
// ========================================

/** Minutes between each order timeline step (for estimated times) */
export const TIMELINE_STEP_INTERVAL_MINUTES = 4;

// ========================================
// OTP CONFIGURATION
// ========================================

/** Length of OTP (One-Time Password) code */
export const OTP_LENGTH = 6;

// ========================================
// PRODUCT CATEGORIES
// ========================================

/** Product category identifiers */
export const PRODUCT_CATEGORIES = {
  ALL: "all",
  PRE_PACKAGED_FLOWER: "pre-packaged-flower",
  HOUSE_FLOWER: "house-flower",
  EDIBLES: "edibles",
  VAPES: "vapes",
  CONCENTRATE: "concentrate",
  MERCH: "merch",
} as const;

// ========================================
// RATING CONFIGURATION
// ========================================

/** Minimum rating value */
export const MIN_RATING = 0;

/** Maximum rating value */
export const MAX_RATING = 5;

// ========================================
// Z-INDEX LAYERS
// ========================================

/** Z-index values for layering (helps prevent z-index conflicts) */
export const Z_INDEX = {
  BACKGROUND: -1,
  BASE: 0,
  DROPDOWN: 10,
  OVERLAY: 20,
  MODAL: 30,
  TOAST: 40,
  TOOLTIP: 50,
} as const;

// ========================================
// API & NETWORK
// ========================================

/** Default API timeout in milliseconds */
export const API_TIMEOUT = 30000;

/** Default retry attempts for failed requests */
export const API_RETRY_ATTEMPTS = 3;

// ========================================
// SOCIALS
// ========================================

/** Telegram username for contact */
export const TELEGRAM_USERNAME = "tdiorio";

/** WhatsApp number for contact */
export const WHATSAPP_NUMBER = "13474859935";
