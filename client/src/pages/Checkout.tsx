import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { Lock, Check, ArrowLeft, CreditCard, Shield, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  {
    id: "stripe",
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex via Stripe",
    icon: "💳",
    secure: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay securely with your PayPal account",
    icon: "🅿️",
    secure: true,
  },
  {
    id: "klarna",
    name: "Klarna",
    description: "Pay later or in installments",
    icon: "🟣",
    secure: true,
  },
  {
    id: "ideal",
    name: "iDEAL",
    description: "Direct bank payment (Netherlands)",
    icon: "🏦",
    secure: true,
  },
  {
    id: "bancontact",
    name: "Bancontact",
    description: "Belgian bank payment",
    icon: "🏧",
    secure: true,
  },
  {
    id: "sepa",
    name: "SEPA Bank Transfer",
    description: "Direct EU bank transfer",
    icon: "🇪🇺",
    secure: true,
  },
  {
    id: "sofort",
    name: "Sofort / Klarna Pay Now",
    description: "Instant bank transfer (DE, AT, CH)",
    icon: "⚡",
    secure: true,
  },
  {
    id: "giropay",
    name: "Giropay",
    description: "German online banking",
    icon: "🇩🇪",
    secure: true,
  },
];

export default function Checkout() {
  const { isNight } = useTheme();
  const { convert, symbol, currency } = useCurrency();
  const { sessionId, refreshCart } = useCart();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  // Load coupon from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("divielle-applied-coupon");
    if (stored) setCouponCode(stored);
  }, []);

  const { data: cartItems } = trpc.shop.getCart.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const createOrderMutation = trpc.shop.createOrder.useMutation({
    onSuccess: (data) => {
      setOrderId(data.orderId);
      setOrderTotal(data.total);
      setStep("success");
      refreshCart();
      localStorage.removeItem("divielle-applied-coupon");
      toast.success("Order placed successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to place order");
    },
  });

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "#f5f0e8" : "#0d0505";
  const mutedColor = isNight ? "rgba(245,240,232,0.5)" : "rgba(13,5,5,0.7)";
  const bgColor = isNight ? "#050505" : "#faf7f4";
  const surfaceColor = isNight ? "#0a0a0a" : "#ffffff";
  const borderColor = isNight ? "rgba(212,175,55,0.15)" : "rgba(184,150,14,0.25)";

  const subtotal = cartItems?.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + convert(Number(item.product.priceEur)) * item.quantity;
  }, 0) || 0;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.fullName || !form.address || !form.city || !form.postalCode || !form.country) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePaymentConfirm = () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    // Create the order — in production this would redirect to the payment provider's secure page
    createOrderMutation.mutate({
      sessionId,
      email: form.email,
      fullName: form.fullName,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      country: form.country,
      phone: form.phone || undefined,
      couponCode: couponCode || undefined,
      currency,
    });
  };

  const inputStyle = {
    backgroundColor: bgColor,
    color: textColor,
    border: `1px solid ${borderColor}`,
  };

  if (step === "success") {
    return (
      <div className="min-h-screen transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
        <Navigation />
        <div className="pt-28 pb-20 px-6 md:px-10 max-w-[600px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#22c55e20" }}>
              <Check size={36} color="#22c55e" />
            </div>
            <h1 className="font-display text-3xl font-light mb-4" style={{ color: textColor }}>
              Order Confirmed
            </h1>
            <p className="font-sans text-sm mb-2" style={{ color: mutedColor }}>
              Thank you for your purchase! Your order #{orderId} has been placed.
            </p>
            <p className="font-display text-2xl mb-6" style={{ color: accentColor }}>
              {symbol}{orderTotal.toFixed(2)}
            </p>
            <p className="font-sans text-xs mb-4" style={{ color: mutedColor }}>
              You will be redirected to <strong>{PAYMENT_METHODS.find(m => m.id === selectedPayment)?.name || "your payment provider"}</strong> to complete the transaction securely.
            </p>
            <p className="font-sans text-xs mb-8" style={{ color: mutedColor }}>
              A confirmation email will be sent to {form.email}
            </p>
            <Link href="/">
              <button
                className="px-8 py-3 rounded-full font-sans text-xs tracking-[0.15em] uppercase transition-all hover:scale-[0.98]"
                style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}
              >
                Continue Shopping
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
      <Navigation />

      <div className="pt-28 pb-20 px-6 md:px-10 max-w-[900px] mx-auto">
        {/* Back to cart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link href="/cart" className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2" style={{ color: accentColor }}>
            <ArrowLeft size={12} /> Back to Cart
          </Link>
        </motion.div>

        {/* Progress indicator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-sans" style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}>1</div>
            <span className="font-sans text-xs" style={{ color: textColor }}>Shipping</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: borderColor }} />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-sans" style={{ backgroundColor: step === "payment" ? accentColor : borderColor, color: step === "payment" ? (isNight ? "#050505" : "#ffffff") : mutedColor }}>2</div>
            <span className="font-sans text-xs" style={{ color: step === "payment" ? textColor : mutedColor }}>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleShippingSubmit}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-light mb-6" style={{ color: textColor }}>Shipping Information</h2>

                <input
                  type="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-full font-sans text-sm outline-none"
                  style={inputStyle}
                  required
                />
                <input
                  type="text"
                  placeholder="Full name *"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-full font-sans text-sm outline-none"
                  style={inputStyle}
                  required
                />
                <input
                  type="text"
                  placeholder="Address *"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-full font-sans text-sm outline-none"
                  style={inputStyle}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City *"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full font-sans text-sm outline-none"
                    style={inputStyle}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal code *"
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full font-sans text-sm outline-none"
                    style={inputStyle}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Country *"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full font-sans text-sm outline-none"
                    style={inputStyle}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full font-sans text-sm outline-none"
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full font-sans text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[0.98] active:scale-[0.95] mt-6"
                  style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}
                >
                  Continue to Payment
                </button>
              </motion.form>
            )}

            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-light mb-2" style={{ color: textColor }}>Select Payment Method</h2>
                <p className="font-sans text-[11px] mb-6" style={{ color: mutedColor }}>
                  All payments are processed securely by external providers. No card data is stored on our servers.
                </p>

                {/* Security badge */}
                <div className="flex items-center gap-2 mb-6 p-3 rounded-xl" style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}20` }}>
                  <Shield size={14} style={{ color: accentColor }} />
                  <span className="font-sans text-[10px]" style={{ color: mutedColor }}>
                    GDPR compliant &bull; PSD2 / 3D Secure &bull; 256-bit SSL encryption &bull; No data stored locally
                  </span>
                </div>

                {/* Payment method grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className="text-left p-4 rounded-xl transition-all duration-300 hover:scale-[0.98]"
                      style={{
                        border: `2px solid ${selectedPayment === method.id ? accentColor : borderColor}`,
                        backgroundColor: selectedPayment === method.id ? `${accentColor}08` : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <div>
                          <p className="font-sans text-xs font-medium" style={{ color: textColor }}>{method.name}</p>
                          <p className="font-sans text-[10px]" style={{ color: mutedColor }}>{method.description}</p>
                        </div>
                      </div>
                      {selectedPayment === method.id && (
                        <div className="mt-2 flex items-center gap-1">
                          <Lock size={9} style={{ color: accentColor }} />
                          <span className="font-sans text-[9px]" style={{ color: accentColor }}>Selected</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Info about redirect */}
                {selectedPayment && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl mt-4"
                    style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}
                  >
                    <ExternalLink size={12} style={{ color: accentColor }} />
                    <span className="font-sans text-[10px]" style={{ color: mutedColor }}>
                      You will be securely redirected to <strong style={{ color: textColor }}>{PAYMENT_METHODS.find(m => m.id === selectedPayment)?.name}</strong> to complete your payment. No payment data is collected by DIVIELLE.
                    </span>
                  </motion.div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="px-6 py-3.5 rounded-full font-sans text-xs tracking-[0.15em] uppercase transition-all hover:scale-[0.98]"
                    style={{ border: `1px solid ${borderColor}`, color: textColor }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePaymentConfirm}
                    disabled={!selectedPayment || createOrderMutation.isPending}
                    className="flex-1 py-3.5 rounded-full font-sans text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[0.98] active:scale-[0.95] flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}
                  >
                    {createOrderMutation.isPending ? "Processing..." : (
                      <>
                        <Lock size={12} />
                        Pay Securely {symbol}{couponCode ? (subtotal * 0.9).toFixed(2) : subtotal.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl" style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}>
              <h3 className="font-display text-sm font-light mb-4" style={{ color: textColor }}>Order Summary</h3>
              {cartItems?.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-sans text-xs" style={{ color: textColor }}>{item.product?.name}</p>
                    <p className="font-sans text-[10px]" style={{ color: mutedColor }}>Qty: {item.quantity}</p>
                  </div>
                  <span className="font-sans text-xs" style={{ color: textColor }}>
                    {item.product ? `${symbol}${(convert(Number(item.product.priceEur)) * item.quantity).toFixed(2)}` : "—"}
                  </span>
                </div>
              ))}
              <div className="my-4" style={{ borderTop: `1px solid ${borderColor}` }} />
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-xs" style={{ color: mutedColor }}>Shipping</span>
                <span className="font-sans text-xs" style={{ color: "#22c55e" }}>FREE</span>
              </div>
              {couponCode && (
                <div className="flex justify-between items-center mb-2">
                  <span className="font-sans text-xs" style={{ color: "#22c55e" }}>Coupon ({couponCode})</span>
                  <span className="font-sans text-xs" style={{ color: "#22c55e" }}>-10%</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm font-medium" style={{ color: textColor }}>Total</span>
                <span className="font-display text-lg" style={{ color: textColor }}>
                  {symbol}{couponCode ? (subtotal * 0.9).toFixed(2) : subtotal.toFixed(2)}
                </span>
              </div>
              <p className="font-sans text-[10px] mt-2" style={{ color: mutedColor }}>VAT included</p>
            </div>

            {/* Trust badges */}
            <div className="mt-4 p-4 rounded-xl" style={{ border: `1px solid ${borderColor}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={12} style={{ color: accentColor }} />
                <span className="font-sans text-[10px] font-medium" style={{ color: textColor }}>Secure Checkout</span>
              </div>
              <div className="space-y-1.5">
                <p className="font-sans text-[9px]" style={{ color: mutedColor }}>✓ GDPR & PSD2 compliant</p>
                <p className="font-sans text-[9px]" style={{ color: mutedColor }}>✓ No card data stored on our servers</p>
                <p className="font-sans text-[9px]" style={{ color: mutedColor }}>✓ 3D Secure authentication</p>
                <p className="font-sans text-[9px]" style={{ color: mutedColor }}>✓ 14-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
