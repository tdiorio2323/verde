import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom luxury cursor with smooth glassmorphism effect
 * Only renders on desktop (hidden on mobile/touch devices)
 * Uses GPU-accelerated transforms for 60fps performance
 */
export function LuxuryCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring animation for cursor movement
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotX = useSpring(cursorX, { damping: 30, stiffness: 500 });
  const dotY = useSpring(cursorY, { damping: 30, stiffness: 500 });

  useEffect(() => {
    // Detect touch devices
    const checkMobile = () => {
      setIsMobile(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkMobile();

    // Don't render cursor on mobile
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, [cursorX, cursorY, isMobile]);

  // Hide on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-white/60"
          animate={{
            scale: isHovering ? 1.5 : 1,
            backgroundColor: isHovering
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0)",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 28,
          }}
          style={{
            backdropFilter: "blur(4px)",
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          x: dotX,
          y: dotY,
        }}
      >
        <div className="relative left-[14px] top-[14px] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" />
      </motion.div>

      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
