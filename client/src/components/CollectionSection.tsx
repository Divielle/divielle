import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useInView } from "@/hooks/useInView";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const COLLECTION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663669831834/BwZJTg8zkqhUYuoxgyUu67/divielle-exp-collection-eabPZf9ccSxconMwaZneDz.webp";
const SHATTER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663669831834/BwZJTg8zkqhUYuoxgyUu67/divielle-exp-shatter-7WuYnpjLAL5UAihDhJ5aLD.webp";
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663669831834/BwZJTg8zkqhUYuoxgyUu67/divielle-exp-hero-YHg7ZU95zssKiHVEcz4L3w.webp";
const LIPS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663669831834/BwZJTg8zkqhUYuoxgyUu67/divielle-exp-lips-CiDDFKWsxLpDZwvs67JyFr.webp";

const COLLECTIONS = [
  {
    id: "lipstick-series",
    slug: "lipstick-series",
    title: "Lipstick Series",
    description: "Bold color, lasting elegance",
    tags: ["Matte", "Satin", "Gloss"],
    image: HERO_IMG,
    priceEur: 42,
  },
  {
    id: "lip-gloss-series",
    slug: "lip-gloss-series",
    title: "Lip Gloss Series",
    description: "Mirror-shine brilliance",
    tags: ["High Shine", "Hydrating"],
    image: LIPS_IMG,
    priceEur: 36,
  },
  {
    id: "palette-series",
    slug: "palette-series",
    title: "Palette Series",
    description: "Curated color stories",
    tags: ["Eyes", "Face", "Multi-use"],
    image: SHATTER_IMG,
    priceEur: 68,
  },
  {
    id: "brushes-series",
    slug: "brushes-series",
    title: "Brushes Series",
    description: "Precision artistry tools",
    tags: ["Professional", "Vegan"],
    image: COLLECTION_IMG,
    priceEur: 54,
  },
];

export default function CollectionSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const { isNight } = useTheme();
  const { formatPrice } = useCurrency();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const hoveredItem = COLLECTIONS.find((c) => c.id === hoveredId);
  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "rgba(255,255,255," : "rgba(13,5,5,";
  const borderColor = isNight ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.15)";

  return (
    <section
      id="collection"
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: isNight ? "#050505" : "#faf8f5" }}
      onMouseMove={handleMouseMove}
    >
      {/* Section header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 mb-16 md:mb-24">
        <div className="flex items-baseline gap-6">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl md:text-4xl font-light transition-colors duration-700"
            style={{ color: `${textColor}0.8)` }}
          >
            Our
          </motion.h3>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl md:text-4xl font-light transition-colors duration-700"
            style={{ color: `${textColor}0.8)` }}
          >
            Collections
          </motion.h3>
        </div>
      </div>

      {/* Collection list */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {COLLECTIONS.map((item, i) => (
          <Link key={item.id} href={`/product/${item.slug}`}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group py-8 md:py-10 cursor-pointer transition-colors duration-700"
              style={{ borderTop: `1px solid ${borderColor}` }}
              data-cursor-hover
            >
              <div className="flex items-center justify-between">
                {/* Title - large italic */}
                <h4
                  className="font-display text-4xl md:text-5xl lg:text-6xl font-light italic transition-colors duration-500"
                  style={{
                    color: hoveredId === item.id ? `${textColor}0.9)` : `${textColor}0.7)`,
                  }}
                >
                  {item.title}
                </h4>

                {/* Right side - metadata */}
                <div className="hidden md:flex items-center gap-8">
                  <span
                    className="font-sans text-[10px] tracking-[0.15em] transition-colors duration-500"
                    style={{ color: `${textColor}0.55)` }}
                  >
                    {item.description}
                  </span>

                  <span
                    className="font-sans text-xs transition-colors duration-500"
                    style={{ color: accentColor }}
                  >
                    {formatPrice(item.priceEur)}
                  </span>

                  <div className="flex gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 transition-all duration-500"
                        style={{
                          border: `1px solid ${borderColor}`,
                          color: `${textColor}0.55)`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Arrow */}
                  <span
                    className="text-lg transition-opacity duration-300"
                    style={{
                      color: accentColor,
                      opacity: hoveredId === item.id ? 1 : 0,
                    }}
                  >
                    &#8599;
                  </span>
                </div>
              </div>

              {/* Mobile metadata */}
              <div className="flex md:hidden items-center gap-4 mt-3">
                <span className="font-sans text-[9px] tracking-[0.15em]" style={{ color: `${textColor}0.55)` }}>
                  {item.description}
                </span>
                <span className="font-sans text-xs" style={{ color: accentColor }}>
                  {formatPrice(item.priceEur)}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}

        {/* Last border */}
        <div className="transition-colors duration-700" style={{ borderTop: `1px solid ${borderColor}` }} />
      </div>

      {/* Floating image on hover */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed pointer-events-none z-[50] hidden md:block"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y - 150,
            }}
          >
            <div
              className="w-[350px] h-[250px] overflow-hidden transition-colors duration-700"
              style={{ border: `1px solid ${borderColor}` }}
            >
              <img
                src={hoveredItem.image}
                alt={hoveredItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2 flex justify-between">
              <span className="font-sans text-[8px] tracking-[0.2em] uppercase" style={{ color: `${textColor}0.55)` }}>
                {hoveredItem.description}
              </span>
              <span className="font-sans text-[8px] tracking-[0.2em] uppercase" style={{ color: accentColor }}>
                ( view )
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
