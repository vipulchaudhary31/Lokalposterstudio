// Local placeholder (figma:asset import replaced for running outside Figma)
const image_c54dfe46038c59054ed3c72dcf43d44ef653d78a = '/placeholder-easter.png';
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from '../../imports/svg-4yinqhoadk';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_EXPO = [0.7, 0, 0.84, 0] as const;

/* ── Exit animation variants ── */
const wrapperVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
};

const backdropVariants = {
  hidden: { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' },
  visible: {
    backdropFilter: 'blur(24px)',
    backgroundColor: 'rgba(0,0,0,0.92)',
    transition: {
      backdropFilter: { duration: 0.6, ease: 'easeOut' },
      backgroundColor: { duration: 1.2, ease: EASE_OUT_EXPO },
    },
  },
  exit: {
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(0,0,0,0)',
    transition: {
      backgroundColor: { duration: 0.8, ease: [0.4, 0, 0.6, 1] },
      backdropFilter: { duration: 1.0, ease: [0.4, 0, 0.2, 1] },
    },
  },
};

const auroraVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.4, delay: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const craftedByVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.7, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.35, ease: EASE_IN_EXPO } },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(16px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { delay: 0.55, duration: 0.8, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    filter: 'blur(20px)',
    transition: { duration: 0.7, ease: [0.5, 0, 0.75, 0] },
  },
};

const taglineVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.85, duration: 0.7, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, y: 5, filter: 'blur(4px)', transition: { duration: 0.3, ease: EASE_IN_EXPO } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { delay: 1.05, duration: 0.7, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, y: 5, filter: 'blur(4px)', transition: { duration: 0.25, ease: EASE_IN_EXPO } },
};

const dismissVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.8, duration: 1.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ── The horizontal LSD logo (gradient blob shapes) ── */
function LsdLogo({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="block w-full h-auto"
        fill="none"
        viewBox="0 0 478 212"
      >
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="ee_grad"
            x1="0"
            x2="454.5"
            y1="158.5"
            y2="41"
          >
            <stop stopColor="#DE04F1" />
            <stop offset="0.5" stopColor="#F84F29" />
            <stop offset="1" stopColor="#FDA900" />
          </linearGradient>
        </defs>
        <path d={svgPaths.p3af2fe00} fill="url(#ee_grad)" />
        <path d={svgPaths.p3aa5db00} fill="url(#ee_grad)" />
        <path d={svgPaths.p1ca40e80} fill="url(#ee_grad)" />
        <path d={svgPaths.p1eac9800} fill="url(#ee_grad)" />
        <foreignObject x="11" y="14" width="78" height="80">
          <p
            style={{
              fontFamily: "'Author', sans-serif",
              fontWeight: 500,
              fontSize: '22.214px',
              lineHeight: '18.2px',
              letterSpacing: '0.01em',
              color: 'white',
              margin: 0,
              whiteSpace: 'pre-wrap',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            LOKAL SCHOOL OF DESIGN
          </p>
        </foreignObject>
      </svg>
    </div>
  );
}

/* ── Cinematic aurora backdrop ── */
function AuroraBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Aurora sweep 1 — magenta arc */}
      <motion.div
        className="absolute"
        style={{
          width: '140%',
          height: '140%',
          left: '-20%',
          top: '-20%',
          background:
            'conic-gradient(from 0deg at 50% 50%, transparent 0deg, #DE04F1 50deg, transparent 110deg, transparent 360deg)',
          opacity: 0.12,
          filter: 'blur(90px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      {/* Aurora sweep 2 — amber arc, counter-rotating */}
      <motion.div
        className="absolute"
        style={{
          width: '140%',
          height: '140%',
          left: '-20%',
          top: '-20%',
          background:
            'conic-gradient(from 200deg at 50% 50%, transparent 0deg, #FDA900 50deg, transparent 110deg, transparent 360deg)',
          opacity: 0.1,
          filter: 'blur(90px)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      />
      {/* Aurora sweep 3 — orange accent, slower */}
      <motion.div
        className="absolute"
        style={{
          width: '120%',
          height: '120%',
          left: '-10%',
          top: '-10%',
          background:
            'conic-gradient(from 100deg at 45% 55%, transparent 0deg, #F84F29 35deg, transparent 75deg, transparent 360deg)',
          opacity: 0.07,
          filter: 'blur(100px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />

      {/* Centered bloom — soft glow behind logo */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 600,
          height: 350,
          background:
            'radial-gradient(ellipse at center, rgba(248,79,41,0.18) 0%, rgba(222,4,241,0.06) 45%, transparent 72%)',
          filter: 'blur(40px)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: [0.5, 0.85, 0.5],
          scale: [0.97, 1.04, 0.97],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette — cinematic dark frame */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Film grain — subtle analog texture */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="ee_grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#ee_grain)" />
        </svg>
      </div>
    </div>
  );
}

interface LsdEasterEggProps {
  open: boolean;
  onClose: () => void;
}

export function LsdEasterEgg({ open, onClose }: LsdEasterEggProps) {
  /* Dismiss on Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  /* Auto-dismiss after 10s */
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer select-none"
          onClick={onClose}
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop — blur comes first, then darkness builds on top */}
          <motion.div
            className="absolute inset-0"
            variants={backdropVariants}
          />

          {/* Aurora ambience */}
          <motion.div
            className="absolute inset-0"
            variants={auroraVariants}
          >
            <AuroraBackdrop />
          </motion.div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-8">
            {/* "Crafted by" label */}
            <motion.div
              className="flex items-center gap-3"
              variants={craftedByVariants}
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/30" />
              <span
                className="text-white/50 tracking-[0.05em]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: '13px',
                }}
              >
                crafted by
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/30" />
            </motion.div>

            {/* Logo */}
            <motion.div
              variants={logoVariants}
            >
              <LsdLogo className="w-[340px] md:w-[420px]" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-white/40 text-center max-w-xs"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: '15px',
                fontWeight: 300,
                letterSpacing: '0.04em',
              }}
              variants={taglineVariants}
            >
              Obsessively designed tools for obsessive designers.
            </motion.p>

            {/* Read our story link */}
            <motion.a
              href="https://medium.com/lokal-design/about"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/35 hover:text-white/70 transition-colors cursor-pointer"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '14px',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                paddingBottom: '1px',
              }}
              variants={linkVariants}
            >
              learn more
            </motion.a>
          </div>

          {/* Dismiss hint — pinned to bottom of viewport */}
          <motion.span
            className="absolute bottom-6 left-0 right-0 text-center text-white/20 z-10"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '11px',
              fontWeight: 300,
              letterSpacing: '0.12em',
            }}
            variants={dismissVariants}
          >
            click anywhere to dismiss
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Subtle sidebar credit badge ── */
export function LsdCredit({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2.5 py-2.5 group cursor-pointer border-t border-border"
      title="About Lokal School of Design"
    >
      {/* "crafted by" label */}
      <span
        className="text-muted-foreground/40 transition-colors shrink-0 leading-none text-[#6160617a]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '11px',
          letterSpacing: '0.05em',
        }}
      >
        crafted by
      </span>

      {/* Thin separator */}
      <span className="h-3.5 w-px bg-border shrink-0" />

      {/* Logo + brand name */}
      <div className="flex items-center gap-1.5 shrink-0 leading-none">
        <img
          src={image_c54dfe46038c59054ed3c72dcf43d44ef653d78a}
          alt="LSD"
          className="w-4 h-4 shrink-0 rounded-[2px] m-[0px]"
        />
        <span className="relative px-[0px] pt-[0px] pb-[2px]">
          <span
            className="tracking-[0.01em] uppercase text-muted-foreground/55 group-hover:text-[#121212e6] dark:group-hover:text-[#FFFFFFe6] transition-colors text-right text-[11px]"
            style={{ fontFamily: "'Author', sans-serif", fontWeight: 500 }}
          >
            Lokal School of Design
          </span>
          <span
            className="absolute left-0 -bottom-[1px] right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left opacity-50"
            style={{
              background: 'linear-gradient(90deg, #DE04F1, #F84F29, #FDA900)',
            }}
          />
        </span>
      </div>
    </button>
  );
}