import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useTheme } from "@/contexts/ThemeContext";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663669831834/BwZJTg8zkqhUYuoxgyUu67/divielle-exp-lips-CiDDFKWsxLpDZwvs67JyFr.webp";
const TEXTURE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663669831834/BwZJTg8zkqhUYuoxgyUu67/divielle-exp-texture-UghZWVCWs2S5xBo6eQ4jhU.webp";

export default function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.15 });
  const { isNight } = useTheme();

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "rgba(255,255,255," : "rgba(13,5,5,";
  const borderColor = isNight ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.15)";

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: isNight ? "#050505" : "#faf8f5" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Large statement text */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 md:mb-40"
        >
          <h2
            className="font-display text-[8vw] md:text-[5vw] lg:text-[4vw] font-light leading-[1.1] max-w-[900px] transition-colors duration-700"
            style={{ color: `${textColor}0.9)` }}
          >
            If you're looking for beauty that transcends the ordinary, you've found your{" "}
            <span className="italic" style={{ color: accentColor }}>maison</span>
          </h2>
        </motion.div>

        {/* About grid with images */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left column - label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="md:col-span-2"
          >
            <span
              className="font-sans text-[9px] tracking-[0.35em] uppercase transition-colors duration-700"
              style={{ color: `${textColor}0.55)` }}
            >
              ( about )
            </span>
          </motion.div>

          {/* Middle - text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5"
          >
            <p
              className="font-serif-body text-xl md:text-2xl font-light leading-relaxed mb-8 transition-colors duration-700"
              style={{ color: `${textColor}0.6)` }}
            >
              DIVIELLE is a luxury cosmetics house born from the intersection of art and science. 
              We craft each formula as a sculptor shapes marble — with precision, patience, and an 
              unwavering commitment to perfection.
            </p>
            <p
              className="font-serif-body text-xl md:text-2xl font-light leading-relaxed mb-12 transition-colors duration-700"
              style={{ color: `${textColor}0.6)` }}
            >
              Our philosophy is rooted in the belief that beauty is not decoration — it is expression. 
              Every shade, every texture, every finish is designed to reveal, not conceal.
            </p>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-6 pt-8 transition-colors duration-700"
              style={{ borderTop: `1px solid ${borderColor}` }}
            >
              <div>
                <span className="font-display text-3xl md:text-4xl font-light" style={{ color: accentColor }}>4</span>
                <p className="font-sans text-[9px] tracking-[0.2em] uppercase mt-2" style={{ color: `${textColor}0.55)` }}>Series</p>
              </div>
              <div>
                <span className="font-display text-3xl md:text-4xl font-light" style={{ color: accentColor }}>47</span>
                <p className="font-sans text-[9px] tracking-[0.2em] uppercase mt-2" style={{ color: `${textColor}0.55)` }}>Shades</p>
              </div>
              <div>
                <span className="font-display text-3xl md:text-4xl font-light" style={{ color: accentColor }}>&infin;</span>
                <p className="font-sans text-[9px] tracking-[0.2em] uppercase mt-2" style={{ color: `${textColor}0.55)` }}>Possibilities</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Images with pixelated reveal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 relative"
          >
            {/* Main image */}
            <div className="relative overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
              <img
                src={HERO_IMG}
                alt="DIVIELLE artistry"
                className="w-full h-[400px] md:h-[500px] object-cover"
                loading="lazy"
              />
              {/* Pixelated overlay that fades */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={inView ? { opacity: 0 } : {}}
                transition={{ duration: 2, delay: 0.8 }}
                className="absolute inset-0"
                style={{
                  backgroundColor: isNight ? "#050505" : "#faf8f5",
                  backgroundImage: `url(${HERO_IMG})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  imageRendering: "pixelated",
                  filter: "blur(4px) brightness(0.3)",
                  transform: "scale(1.05)",
                }}
              />
            </div>

            {/* Secondary image - offset */}
            <div
              className="relative overflow-hidden mt-4 ml-8 md:ml-16 w-3/4"
              style={{ border: `1px solid ${borderColor}` }}
            >
              <img
                src={TEXTURE_IMG}
                alt="DIVIELLE texture"
                className="w-full h-[200px] md:h-[250px] object-cover"
                loading="lazy"
              />
              <motion.div
                initial={{ opacity: 1 }}
                animate={inView ? { opacity: 0 } : {}}
                transition={{ duration: 2, delay: 1.2 }}
                className="absolute inset-0"
                style={{
                  backgroundColor: isNight ? "#050505" : "#faf8f5",
                  backgroundImage: `url(${TEXTURE_IMG})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  imageRendering: "pixelated",
                  filter: "blur(4px) brightness(0.3)",
                  transform: "scale(1.05)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
