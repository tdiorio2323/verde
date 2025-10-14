import { motion } from 'framer-motion';

export default function BackgroundGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(123,92,243,.18),transparent_60%)]" />
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:40px_40px]"
        style={{maskImage:'radial-gradient(ellipse at center, black 60%, transparent 100%)'}}
      />
      <motion.div
        className="absolute -inset-24 bg-gradient-to-r from-[#7b5cf3]/25 via-transparent to-[#f2b8ff]/20 blur-3xl"
        initial={{ opacity: .3, rotate: -15 }}
        animate={{ opacity: .6, rotate: 15 }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.15) 50%, transparent 51%), radial-gradient(2px 2px at 80% 70%, rgba(255,255,255,.12) 50%, transparent 51%)'
        }}
        initial={{ backgroundPosition: '0% 0%, 100% 100%' }}
        animate={{ backgroundPosition: '100% 0%, 0% 100%' }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
