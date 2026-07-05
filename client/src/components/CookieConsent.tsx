import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const { isNight } = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("divielle-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("divielle-cookie-consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("divielle-cookie-consent", "declined");
    setShow(false);
  };

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "#f5f0e8" : "#0d0505";
  const mutedColor = isNight ? "rgba(245,240,232,0.5)" : "rgba(13,5,5,0.7)";
  const surfaceColor = isNight ? "rgba(10,10,10,0.97)" : "rgba(255,255,255,0.97)";
  const borderColor = isNight ? "rgba(212,175,55,0.15)" : "rgba(212,175,55,0.25)";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-[420px] z-[9990] p-5 rounded-2xl"
          style={{
            backgroundColor: surfaceColor,
            border: `1px solid ${borderColor}`,
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-start gap-3">
            <Cookie size={18} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
            <div className="flex-1">
              <p className="font-sans text-xs leading-relaxed mb-3" style={{ color: mutedColor }}>
                We use cookies to enhance your experience. By continuing, you agree to our{" "}
                <a href="/legal" className="underline" style={{ color: accentColor }}>Cookie Policy</a>{" "}
                and{" "}
                <a href="/legal" className="underline" style={{ color: accentColor }}>Terms & Conditions</a>.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase transition-all hover:scale-[0.98]"
                  style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}
                >
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase transition-all hover:scale-[0.98]"
                  style={{ border: `1px solid ${borderColor}`, color: mutedColor }}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
