import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663669831834/BwZJTg8zkqhUYuoxgyUu67/divielle-exp-hero-YHg7ZU95zssKiHVEcz4L3w.webp";

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isNight } = useTheme();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.35], [0, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.35, 0.55, 0.7], [0, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.65, 0.8, 0.95], [0, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [80, 0]);
  const y2 = useTransform(scrollYProgress, [0.35, 0.55], [80, 0]);
  const y3 = useTransform(scrollYProgress, [0.65, 0.8], [80, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "rgba(255,255,255," : "rgba(13,5,5,";

  return (
    <section
      ref={containerRef}
      className="relative min-h-[300vh] transition-colors duration-1000"
      style={{ backgroundColor: isNight ? "#050505" : "#f0ede8" }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0"
        >
          <img
            src={HERO_IMG}
            alt="DIVIELLE Collection"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 transition-colors duration-1000"
            style={{ backgroundColor: isNight ? "rgba(0,0,0,0.75)" : "rgba(240,237,232,0.82)" }}
          />
        </motion.div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${accentColor}80 1px, transparent 1px), linear-gradient(90deg, ${accentColor}80 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Content Layers */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 w-full">
          {/* Story 1 */}
          <motion.div
            style={{ opacity: opacity1, y: y1 }}
            className="absolute inset-x-6 md:inset-x-10"
          >
            <h2
              className="font-display text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-light leading-[0.95] max-w-4xl transition-colors duration-700"
              style={{ color: `${textColor}0.9)` }}
            >
              Precision in
              <br />
              <span className="italic" style={{ color: `${accentColor}CC` }}>Every Detail</span>
            </h2>
            <p
              className="font-serif-body text-lg lg:text-xl font-light mt-8 max-w-lg transition-colors duration-700"
              style={{ color: `${textColor}0.4)` }}
            >
              Each DIVIELLE product is crafted through meticulous steps, ensuring unparalleled quality and performance.
            </p>
          </motion.div>

          {/* Story 2 */}
          <motion.div
            style={{ opacity: opacity2, y: y2 }}
            className="absolute inset-x-6 md:inset-x-10"
          >
            <h2
              className="font-display text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-light leading-[0.95] max-w-4xl transition-colors duration-700"
              style={{ color: `${textColor}0.9)` }}
            >
              Colors That
              <br />
              <span className="italic" style={{ color: `${accentColor}CC` }}>Tell Stories</span>
            </h2>
            <p
              className="font-serif-body text-lg lg:text-xl font-light mt-8 max-w-lg transition-colors duration-700"
              style={{ color: `${textColor}0.4)` }}
            >
              Inspired by the world's most captivating landscapes, our shades capture emotions in their purest form.
            </p>
          </motion.div>

          {/* Story 3 */}
          <motion.div
            style={{ opacity: opacity3, y: y3 }}
            className="absolute inset-x-6 md:inset-x-10"
          >
            <h2
              className="font-display text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-light leading-[0.95] max-w-4xl transition-colors duration-700"
              style={{ color: `${textColor}0.9)` }}
            >
              A Legacy of
              <br />
              <span className="italic" style={{ color: `${accentColor}CC` }}>Elegance</span>
            </h2>
            <p
              className="font-serif-body text-lg lg:text-xl font-light mt-8 max-w-lg transition-colors duration-700"
              style={{ color: `${textColor}0.4)` }}
            >
              DIVIELLE is more than a brand. It is a movement — redefining beauty standards with every collection we create.
            </p>
          </motion.div>
        </div>

        {/* Progress line - right side */}
        <div
          className="absolute right-6 md:right-10 top-[10%] bottom-[10%] w-px hidden md:block transition-colors duration-700"
          style={{ backgroundColor: `${textColor}0.05)` }}
        >
          <motion.div
            style={{ height: lineProgress }}
            className="w-full origin-top"
            initial={false}
          >
            <div className="w-full h-full" style={{ backgroundColor: `${accentColor}66` }} />
          </motion.div>
        </div>

        {/* Bottom corner info */}
        <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 flex justify-between">
          <span
            className="font-sans text-[8px] tracking-[0.2em] uppercase transition-colors duration-700"
            style={{ color: `${textColor}0.15)` }}
          >
            scroll to explore
          </span>
          <span
            className="font-sans text-[8px] tracking-[0.2em] uppercase transition-colors duration-700"
            style={{ color: `${textColor}0.15)` }}
          >
            3 chapters
          </span>
        </div>
      </div>
    </section>
  );
}
