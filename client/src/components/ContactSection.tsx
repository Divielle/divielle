import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

export default function ContactSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const { isNight } = useTheme();
  const [email, setEmail] = useState("");

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "rgba(255,255,255," : "rgba(13,5,5,";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast("Thank you. We'll be in touch soon.");
      setEmail("");
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: isNight ? "#050505" : "#faf8f5" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Header text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span
            className="font-sans text-[9px] tracking-[0.35em] uppercase block mb-4 transition-colors duration-700"
            style={{ color: `${textColor}0.55)` }}
          >
            get in touch
          </span>
          <span
            className="font-sans text-[9px] tracking-[0.35em] uppercase block transition-colors duration-700"
            style={{ color: `${textColor}0.55)` }}
          >
            right now
          </span>
        </motion.div>

        {/* Email input - large and dramatic */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto mb-24 md:mb-40"
        >
          <div
            className="flex items-center pb-4 transition-colors duration-500"
            style={{ borderBottom: `1px solid ${isNight ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}` }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Youremail@gmail.com"
              className="flex-1 bg-transparent font-serif-body text-2xl md:text-4xl focus:outline-none transition-colors duration-300"
              style={{
                color: `${textColor}0.6)`,
              }}
              data-cursor-hover
            />
            <button
              type="submit"
              className="ml-4 font-sans text-[9px] tracking-[0.35em] uppercase px-4 py-2 transition-all duration-300"
              style={{
                color: accentColor,
                border: `1px solid ${accentColor}4D`,
              }}
              data-cursor-hover
            >
              ( &#8599; )
            </button>
          </div>
          <p
            className="font-sans text-[9px] tracking-[0.2em] uppercase mt-4 transition-colors duration-700"
            style={{ color: `${textColor}0.2)` }}
          >
            leave your email and we'll be in touch soon
          </p>
        </motion.form>

        {/* Navigation links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex justify-center gap-8 md:gap-16 mb-24 md:mb-40"
        >
          {[
            { label: "ABOUT", href: "#about" },
            { label: "COLLECTION", href: "#collection" },
            { label: "EXPERIENCE", href: "#experience" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-[9px] tracking-[0.35em] uppercase transition-colors duration-300 flex items-center gap-2"
              style={{ color: `${textColor}0.55)` }}
              data-cursor-hover
            >
              ( &#8599; {link.label} )
            </a>
          ))}
        </motion.div>

        {/* Brand name oversized */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="text-center overflow-hidden">
            <span
              className="font-display text-[20vw] md:text-[16vw] lg:text-[14vw] font-light leading-none select-none block italic transition-colors duration-1000"
              style={{ color: `${accentColor}14` }}
            >
              Divielle
            </span>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 transition-colors duration-700"
            style={{ borderTop: `1px solid ${isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}
          >
            <span
              className="font-sans text-[9px] tracking-[0.2em] uppercase transition-colors duration-700"
              style={{ color: `${textColor}0.2)` }}
            >
              ( DIVIELLE ) Luxury Cosmetics
            </span>
            <span
              className="font-sans text-[9px] tracking-[0.2em] uppercase transition-colors duration-700"
              style={{ color: `${textColor}0.2)` }}
            >
              Athens, Greece
            </span>
            <span
              className="font-sans text-[9px] tracking-[0.2em] uppercase transition-colors duration-700"
              style={{ color: `${textColor}0.2)` }}
            >
              Crafted with obsession
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
