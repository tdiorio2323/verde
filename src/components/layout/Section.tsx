import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fr } from "@/lib/motion";

export default function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id={id} ref={ref} className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        {(title || subtitle) && (
          <motion.div
            variants={fr.fadeUp()}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mb-10"
          >
            {title && (
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
            )}
            {subtitle && <p className="mt-2 text-sm text-white/60 max-w-2xl">{subtitle}</p>}
          </motion.div>
        )}
        <motion.div variants={fr.stagger()} initial="hidden" animate={inView ? "show" : "hidden"}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
