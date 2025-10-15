import * as React from "react"

/** Breakpoint in pixels for mobile/tablet distinction */
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to detect if the current viewport is mobile-sized.
 * Uses window.matchMedia for responsive media query detection.
 * Updates automatically when viewport size changes.
 *
 * @returns boolean - true if viewport width is less than 768px (mobile), false otherwise
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileNav /> : <DesktopNav />;
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Use mql.matches for initial state (more reliable and works in older browsers)
    const onChange = () => {
      setIsMobile(mql.matches)
    }

    // Check for addEventListener support (fallback for older browsers)
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      // Fallback for older browsers that don't support addEventListener
      mql.addListener(onChange)
    }

    // Set initial state using mql.matches instead of window.innerWidth
    setIsMobile(mql.matches)

    // Return cleanup function that handles both modern and legacy browsers
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        // Fallback for older browsers
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isMobile
}
