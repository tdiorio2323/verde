import { motion } from 'framer-motion';
import { fr } from '@/lib/motion';
import { ReactNode } from 'react';

/**
 * FeatureCard component props interface
 */
export interface FeatureCardProps {
  /** Icon element to display in the card header */
  icon: ReactNode;
  /** Title text for the feature */
  title: string;
  /** Array of bullet point descriptions */
  bullets: string[];
}

/**
 * FeatureCard component displays a feature with an icon, title, and bullet points.
 * Includes hover animation effects and glass morphism styling.
 *
 * @param props - FeatureCard component props
 * @returns Animated feature card component
 */
export default function FeatureCard({
  icon,
  title,
  bullets
}: FeatureCardProps) {
  return (
    <motion.div
      variants={fr.fadeUp()}
      className="group relative rounded-2xl p-5 bg-white/5 backdrop-blur border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,.04)]"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-3 relative">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/7">{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-white/70 relative">
        {bullets.map((b, i) => (
          <li
            key={i}
            className="pl-5 relative before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-white/30"
          >
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
