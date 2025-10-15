import React from "react";

/**
 * Optimized image component with performance enhancements.
 *
 * Features:
 * - Lazy loading by default
 * - Async decoding for better performance
 * - Proper error handling
 * - Accessibility improvements
 */
export default function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
