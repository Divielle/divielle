import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.random() * 10 + 3;
      current = Math.min(current + increment, 100);
      setProgress(Math.floor(current));

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            onComplete?.();
          }, 800);
        }, 400);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#050505" }}
        >
          {/* Soft radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 40% 50% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)",
            }}
          />

          {/* Brand name - elegant entrance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl tracking-[0.5em] uppercase font-light"
              style={{ color: "#f5f0e8" }}
            >
              DIVIELLE
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1, duration: 1 }}
              className="font-serif-body text-sm md:text-base mt-4 italic tracking-wider"
              style={{ color: "#f5f0e8" }}
            >
              Where beauty becomes art
            </motion.p>
          </motion.div>

          {/* Elegant thin progress line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-48 md:w-64"
          >
            <div className="h-[1px] w-full relative overflow-hidden" style={{ backgroundColor: "rgba(245,240,232,0.1)" }}>
              <motion.div
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #D4AF37, #F5E6A3)",
                }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <span className="font-sans text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(245,240,232,0.3)" }}>
                Loading
              </span>
              <span className="font-sans text-[9px] tracking-[0.15em]" style={{ color: "rgba(212,175,55,0.7)" }}>
                {progress}%
              </span>
            </div>
          </motion.div>

          {/* Subtle decorative line at bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-[0.5px]"
            style={{ backgroundColor: "rgba(212,175,55,0.3)" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
