import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function GlowButton({
  href = '#',
  children,
  className
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium",
        "bg-white/5 backdrop-blur border border-white/10",
        "transition-transform duration-200 hover:scale-[1.02] active:scale-[.99]",
        "shadow-[0_0_0_0_rgba(123,92,243,0.0)] hover:shadow-[0_0_40px_4px_rgba(123,92,243,0.25)]",
        className
      )}
    >
      {children}
    </Link>
  );
}
