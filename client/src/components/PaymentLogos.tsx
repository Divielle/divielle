import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const PAYMENT_METHODS = [
  { name: "Visa", svg: "M46.2 11.3H38l-5.1 31.4h8.2l5.1-31.4zm-17.4 0l-7.7 21.5-0.9-4.6-3-15.3s-0.4-1.6-4.1-1.6H0.5l-0.1 0.6s4.1 0.9 8.9 3.8l7.4 28.6h8.5l13-33H28.8zm44.3 31.4h7.5l-6.5-31.4h-6.6c-3 0-3.8 2.4-3.8 2.4l-12.2 29h8.5l1.7-4.7h10.4l1 4.7zm-9-11.2l4.3-11.8 2.4 11.8h-6.7zM63.7 17.6l1.2-6.8s-3.6-1.4-7.4-1.4c-4.1 0-13.8 1.8-13.8 10.5 0 8.2 11.4 8.3 11.4 12.6s-10.2 3.5-13.6 0.8l-1.2 7.1s3.7 1.8 9.3 1.8c5.6 0 14.1-2.9 14.1-10.9 0-8.2-11.5-9-11.5-12.6 0-3.5 8-3.1 11.5-1.1z" },
  { name: "Mastercard", svg: "M36 6.3c-5.9 0-11.2 2.5-14.9 6.5h5.8c3.2 3.5 5.1 8.1 5.1 13.2s-1.9 9.7-5.1 13.2h-5.8c3.7 4 9 6.5 14.9 6.5 11.3 0 20.4-8.8 20.4-19.7S47.3 6.3 36 6.3zM21.1 12.8c-3.7-4-9-6.5-14.9-6.5C-5.1 6.3-14 15.1-14 26s8.9 19.7 20.2 19.7c5.9 0 11.2-2.5 14.9-6.5h-5.8c-3.2-3.5-5.1-8.1-5.1-13.2s1.9-9.7 5.1-13.2h5.8z" },
  { name: "Apple Pay", text: "Apple Pay" },
  { name: "Google Pay", text: "Google Pay" },
  { name: "PayPal", text: "PayPal" },
  { name: "Klarna", text: "Klarna" },
  { name: "iDEAL", text: "iDEAL" },
  { name: "SEPA", text: "SEPA" },
];

export default function PaymentLogos() {
  const { isNight } = useTheme();
  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const mutedColor = isNight ? "rgba(245,240,232,0.3)" : "rgba(13,5,5,0.5)";
  const borderColor = isNight ? "rgba(212,175,55,0.1)" : "rgba(212,175,55,0.15)";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 px-6"
    >
      <div className="max-w-[900px] mx-auto text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: mutedColor }}>
          Secure payments across Europe
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.name}
              className="px-4 py-2.5 rounded-lg flex items-center justify-center"
              style={{ border: `1px solid ${borderColor}`, minWidth: "80px" }}
            >
              <span className="font-sans text-[10px] font-medium tracking-wide" style={{ color: mutedColor }}>
                {method.text || method.name}
              </span>
            </div>
          ))}
        </div>
        <p className="font-sans text-[9px] mt-6 opacity-50" style={{ color: mutedColor }}>
          All transactions are secured with 256-bit SSL encryption. EU PSD2 compliant.
        </p>
      </div>
    </motion.section>
  );
}
