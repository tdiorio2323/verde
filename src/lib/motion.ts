export const fr = {
  fadeUp: (delay = 0) => ({
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
  }),
  stagger: (stagger = 0.08) => ({
    show: { transition: { staggerChildren: stagger } },
  }),
};
