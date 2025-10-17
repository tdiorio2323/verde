import { Variants, Transition } from "framer-motion";

// Premium easing curves for luxury feel
export const ease = {
  smooth: [0.4, 0, 0.2, 1], // Tailwind's default ease-out
  bounce: [0.68, -0.55, 0.265, 1.55],
  glass: [0.25, 0.46, 0.45, 0.94],
  liquid: [0.34, 1.56, 0.64, 1],
  elastic: [0.5, 1.25, 0.75, 1.25],
} as const;

// Performance-optimized transition defaults
const defaultTransition: Transition = {
  duration: 0.5,
  ease: ease.smooth,
};

const quickTransition: Transition = {
  duration: 0.3,
  ease: ease.smooth,
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...defaultTransition,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: ease.smooth,
    },
  },
};

// Fade transitions
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: quickTransition,
  },
};

// Slide up variants
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

// Scale pop variants
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      ...defaultTransition,
      ease: ease.elastic,
    },
  },
};

// Hover interaction variants
export const hoverVariants = {
  lift: {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: ease.glass,
      },
    },
  },
  glow: {
    rest: { filter: "brightness(1)" },
    hover: {
      filter: "brightness(1.1)",
      transition: {
        duration: 0.3,
        ease: ease.smooth,
      },
    },
  },
  scale: {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: ease.elastic,
      },
    },
  },
} as const;

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Legacy API compatibility
export const fr = {
  fadeUp: (delay = 0): Variants => ({
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ...defaultTransition,
        delay,
      },
    },
  }),
  stagger: (stagger = 0.08): Variants => ({
    show: {
      transition: {
        staggerChildren: stagger,
      },
    },
  }),

  // New helpers
  fadeIn: (delay = 0): Variants => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        ...defaultTransition,
        delay,
      },
    },
  }),

  scaleIn: (delay = 0): Variants => ({
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        ...defaultTransition,
        delay,
        ease: ease.elastic,
      },
    },
  }),

  slideLeft: (delay = 0): Variants => ({
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        ...defaultTransition,
        delay,
      },
    },
  }),

  slideRight: (delay = 0): Variants => ({
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        ...defaultTransition,
        delay,
      },
    },
  }),
};
