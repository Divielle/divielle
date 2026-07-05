import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

export default function NewsletterPopup() {
  const { isNight } = useTheme();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");

  const subscribeMutation = trpc.shop.subscribeNewsletter.useMutation({
    onSuccess: () => {
      toast.success("Welcome to the DIVIELLE family!");
      localStorage.setItem("divielle-newsletter-dismissed", "true");
      setShow(false);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  useEffect(() => {
    const dismissed = localStorage.getItem("divielle-newsletter-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeMutation.mutate({ email: email.trim() });
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("divielle-newsletter-dismissed", "true");
  };

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "#f5f0e8" : "#0d0505";
  const mutedColor = isNight ? "rgba(245,240,232,0.5)" : "rgba(13,5,5,0.7)";
  const surfaceColor = isNight ? "rgba(10,10,10,0.95)" : "rgba(255,255,255,0.95)";
  const borderColor = isNight ? "rgba(212,175,55,0.2)" : "rgba(212,175,55,0.3)";

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-6 pointer-events-none"
          >
            <div
              className="relative w-full max-w-[420px] p-8 rounded-2xl pointer-events-auto"
              style={{
                backgroundColor: surfaceColor,
                border: `1px solid ${borderColor}`,
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-full transition-opacity hover:opacity-70"
              >
                <X size={16} style={{ color: mutedColor }} />
              </button>

              {/* Content */}
              <div className="text-center">
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: accentColor }}>
                  Join the DIVIELLE Family
                </p>
                <h2 className="font-display text-2xl font-light mb-3" style={{ color: textColor }}>
                  Stay <span className="italic">Beautiful</span>
                </h2>
                <p className="font-sans text-xs leading-relaxed mb-6" style={{ color: mutedColor }}>
                  Subscribe to our newsletter for exclusive access to new collections, beauty tips, and special offers.
                </p>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-full font-sans text-sm outline-none"
                    style={{
                      backgroundColor: isNight ? "#141414" : "#f5f0ea",
                      color: textColor,
                      border: `1px solid ${borderColor}`,
                    }}
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscribeMutation.isPending}
                    className="px-5 py-3 rounded-full font-sans text-[10px] tracking-[0.15em] uppercase transition-all hover:scale-[0.98] active:scale-[0.95]"
                    style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}
                  >
                    {subscribeMutation.isPending ? "..." : "Subscribe"}
                  </button>
                </form>

                <p className="font-sans text-[9px] mt-4 opacity-50" style={{ color: mutedColor }}>
                  By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
