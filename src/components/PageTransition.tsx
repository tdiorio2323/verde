import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";
import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps page content with smooth entry/exit transitions
 * Optimized for mobile performance with GPU-accelerated transforms
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{
        // Force GPU acceleration for smooth 60fps
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
    >
      {children}
    </motion.div>
  );
}
