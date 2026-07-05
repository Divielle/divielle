import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";

export default function Navigation() {
  const { theme, setTheme, isNight } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setLogoVisible(false);
      } else {
        setLogoVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "COLLECTIONS", href: "#collection" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "ABOUT", href: "#about" },
    { label: "CONTACT", href: "#contact" },
    { label: "LEGAL", href: "/legal" },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleThemeSwitch = (mode: "classic" | "nights") => {
    if (mode === theme) return;
    document.body.classList.add("theme-transition-active");
    setTheme(mode);
    setTimeout(() => {
      document.body.classList.remove("theme-transition-active");
    }, 1500);
  };

  return (
    <>
      {/* Fixed navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="fixed top-0 left-0 right-0 z-[1000] py-5 md:py-6"
      >
        <div className="flex justify-between items-center px-6 md:px-10">
          {/* Left - Currency selector */}
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="font-sans text-[10px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5"
              style={{ color: "var(--theme-text)" }}
              data-cursor-hover
            >
              {currency}
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={`transition-transform duration-200 ${currencyOpen ? "rotate-180" : ""}`}>
                <path d="M1 3L4 6L7 3" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-8 left-0 border py-2 min-w-[70px] rounded-lg"
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    borderColor: "var(--theme-border)",
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                      className={`block w-full text-left px-4 py-1.5 font-sans text-[10px] tracking-[0.15em] transition-all duration-200 ${
                        c === currency ? "opacity-100" : "opacity-50 hover:opacity-80"
                      }`}
                      style={{ color: "var(--theme-text)" }}
                      data-cursor-hover
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center - Logo with scroll hide/show */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            animate={{
              y: logoVisible ? 0 : -60,
              opacity: logoVisible ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2"
            data-cursor-hover
          >
            <span
              className="font-display text-lg md:text-xl tracking-[0.4em] uppercase font-medium"
              style={{ color: '#d4af37' }}
            >
              DIVIELLE
            </span>
          </motion.button>

          {/* Right - Cart + Theme toggle + Menu */}
          <div className="flex items-center gap-5">
            {/* Cart icon */}
            <Link href="/cart">
              <button
                className="relative opacity-70 hover:opacity-100 transition-opacity duration-300"
                style={{ color: "var(--theme-text)" }}
                data-cursor-hover
              >
                <ShoppingBag size={16} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center font-sans text-[8px] font-bold"
                    style={{
                      backgroundColor: isNight ? "#D4AF37" : "#C41E3A",
                      color: isNight ? "#050505" : "#ffffff",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Classic / Nights Toggle */}
            <div className="hidden sm:flex items-center gap-0 rounded-full overflow-hidden border" style={{ borderColor: "var(--theme-border)" }}>
              <button
                onClick={() => handleThemeSwitch("classic")}
                className={`px-3 py-1.5 font-sans text-[9px] tracking-[0.2em] uppercase transition-all duration-500 ${
                  theme === "classic"
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
                style={{
                  color: theme === "classic" ? "#ffffff" : "var(--theme-text)",
                  backgroundColor: theme === "classic" ? "#D4AF37" : "transparent",
                }}
                data-cursor-hover
              >
                Classic
              </button>
              <button
                onClick={() => handleThemeSwitch("nights")}
                className={`px-3 py-1.5 font-sans text-[9px] tracking-[0.2em] uppercase transition-all duration-500 ${
                  theme === "nights"
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
                style={{
                  color: theme === "nights" ? "#D4AF37" : "var(--theme-text)",
                  backgroundColor: theme === "nights" ? "#050505" : "transparent",
                }}
                data-cursor-hover
              >
                Nights
              </button>
            </div>

            {/* Menu trigger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="font-sans text-[10px] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-100 opacity-70"
              style={{ color: "var(--theme-text)" }}
              data-cursor-hover
            >
              {menuOpen ? "CLOSE" : "MENU"}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[998] backdrop-blur-md flex items-center justify-center"
            style={{ backgroundColor: isNight ? "rgba(5,5,5,0.97)" : "rgba(248,246,243,0.97)" }}
          >
            <div className="flex flex-col items-center gap-8">
              {/* Mobile theme toggle */}
              <div className="sm:hidden flex items-center gap-0 rounded-full overflow-hidden border mb-8" style={{ borderColor: "var(--theme-border)" }}>
                <button
                  onClick={() => handleThemeSwitch("classic")}
                  className={`px-4 py-2 font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${
                    theme === "classic" ? "opacity-100" : "opacity-40"
                  }`}
                  style={{
                    color: theme === "classic" ? "#ffffff" : "var(--theme-text)",
                    backgroundColor: theme === "classic" ? "#D4AF37" : "transparent",
                  }}
                  data-cursor-hover
                >
                  Classic
                </button>
                <button
                  onClick={() => handleThemeSwitch("nights")}
                  className={`px-4 py-2 font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${
                    theme === "nights" ? "opacity-100" : "opacity-40"
                  }`}
                  style={{
                    color: theme === "nights" ? "#D4AF37" : "var(--theme-text)",
                    backgroundColor: theme === "nights" ? "#050505" : "transparent",
                  }}
                  data-cursor-hover
                >
                  Nights
                </button>
              </div>

              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => scrollTo(link.href)}
                  className="group flex items-center gap-4"
                  data-cursor-hover
                >
                  <span
                    className="font-display text-4xl md:text-6xl lg:text-7xl font-light italic opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: "var(--theme-text)" }}
                  >
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
