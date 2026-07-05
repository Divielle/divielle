import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export default function Marquee() {
  const { isNight } = useTheme();

  const items = [
    "LIPSTICK SERIES",
    "LIP GLOSS SERIES",
    "PALETTE SERIES",
    "BRUSHES SERIES",
    "DIVIELLE",
    "LUXURY",
    "ARTISTRY",
  ];

  const text = items.join(" — ");
  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "rgba(255,255,255,0.06)" : "rgba(13,5,5,0.06)";
  const borderColor = isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  return (
    <div
      className="relative py-12 md:py-16 overflow-hidden transition-colors duration-1000"
      style={{
        backgroundColor: isNight ? "#050505" : "#faf8f5",
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="font-display text-[4vw] md:text-[2.5vw] font-light italic mx-4 select-none transition-colors duration-700"
            style={{ color: isNight ? '#d4af37' : '#C41E3A' }}
          >
            {text} — {text} —&nbsp;
          </span>
        ))}
      </motion.div>

      {/* Accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-colors duration-700"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}33, transparent)` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-colors duration-700"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}33, transparent)` }}
      />
    </div>
  );
}
